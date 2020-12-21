import * as PIXI from 'pixi.js';
import Bullet from './bullet';
import { AnimationsNames, DefaultTextureSize, DIRECTION_NAMES, ElementTypeNames } from '../../../constants';
import { app } from '../../../../index';
import { AnimatedSprite } from 'pixi.js';
import { TypeItemsCollision } from '../../../../interfaces';
import { itemsIntersect } from '../../../../utils';
import { TweenMax } from 'gsap';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Bonus from './bonus';

export default class TankEnemy extends PIXI.Container {
    public type: string;
    public id: string;
    public tankSprite: PIXI.Sprite;
    public possibleCollision: Array<TypeItemsCollision>;
    public currentDirection: string;
    public currentBonus: Bonus;
    private RECHARGE_MARK_OFFSET: number = 3.5;
    protected ticker: PIXI.Ticker;
    protected speed: number = 1;
    protected bullet: Bullet;
    protected rechargeMark: PIXI.Graphics;
    protected inMove: boolean;
    protected isDrown: boolean = false;
    protected isKilled: boolean = false;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super();
        this.type = type;
        this.id = uuidv4();
        this.tankSprite = new PIXI.Sprite(texture);
        this.tankSprite.x = DefaultTextureSize.WIDTH * j + DefaultTextureSize.WIDTH / 2;
        this.tankSprite.y = DefaultTextureSize.HEIGHT * i + DefaultTextureSize.HEIGHT / 2;
        this.tankSprite.anchor.set(0.5);
        this.ticker = new PIXI.Ticker();
        this.rechargeMark = new PIXI.Graphics();
        this.rechargeMark.beginFill(0x4df546);
        this.rechargeMark.drawRect(0, 0, this.tankSprite.width, 3);
        this.rechargeMark.endFill();
        this.rechargeMark.alpha = 0.8;
        this.ticker.add(() => this.update());
        this.ticker.start();
        this.addChild(this.tankSprite);
        app.mainGameModule.collisionLogic.addEnemyTank(this);
        this.loop();
        this.updatePossibleCollision();
    }

    protected loop(): void {
        if (this.isKilled) {
            return;
        }
        const directions: Array<string> = [DIRECTION_NAMES.LEFT, DIRECTION_NAMES.RIGHT, DIRECTION_NAMES.DOWN, DIRECTION_NAMES.UP];
        const x = this.tankSprite.x;
        const y = this.tankSprite.y;
        this.bullet = new Bullet(ElementTypeNames.BULLET_ENEMY, this.currentDirection, x, y);
        this.setDirection(directions[_.random(0, directions.length)]);
        TweenMax.delayedCall(1, () => this.loop());
    }

    public updatePossibleCollision(): void {
        this.possibleCollision = app.mainGameModule.collisionLogic.findTankPossibleCollision(this);
    }

    public update(): void {
        if (this.isDrown) {
            return;
        }
        if (!this.inMove) {
            this.ticker.stop();
            return;
        }

        this.rechargeMark.x = this.tankSprite.x - (this.tankSprite.width / 2);
        this.rechargeMark.y = this.tankSprite.y + (this.tankSprite.height / 2);
        switch (this.currentDirection) {
            case DIRECTION_NAMES.UP : {
                this.tankSprite.y -= this.speed;
                this.tankSprite.angle = 0;
                this.rechargeMark.angle = 0;
                this.rechargeMark.y -= this.RECHARGE_MARK_OFFSET;
                break;
            }
            case DIRECTION_NAMES.LEFT : {
                this.tankSprite.x -= this.speed;
                this.tankSprite.angle = 270;
                this.rechargeMark.angle = 90;
                this.rechargeMark.y -= this.tankSprite.height - this.RECHARGE_MARK_OFFSET;
                this.rechargeMark.x += this.tankSprite.height - this.RECHARGE_MARK_OFFSET;
                break;
            }
            case DIRECTION_NAMES.DOWN : {
                this.tankSprite.y += this.speed;
                this.tankSprite.angle = 180;
                this.rechargeMark.angle = 0;
                this.rechargeMark.y -= this.tankSprite.height;
                break;
            }
            case DIRECTION_NAMES.RIGHT : {
                this.tankSprite.x += this.speed;
                this.tankSprite.angle = 90;
                this.rechargeMark.angle = 90;
                this.rechargeMark.y -= this.tankSprite.height - this.RECHARGE_MARK_OFFSET;
                break;
            }
        }
        this.setSpeed(1);
        const collisionItem = this.possibleCollision?.find((item: TypeItemsCollision) =>
            itemsIntersect(this, item));
        if (collisionItem) {
            this.onCollisionHappened(collisionItem);
        }
    }

    protected onCollisionHappened(collisionItem: TypeItemsCollision): void {
        if (collisionItem.type === ElementTypeNames.BONUS_SLOW
            || collisionItem.type === ElementTypeNames.BONUS_LIVE
            || collisionItem.type === ElementTypeNames.BONUS_IMMORTAL
            || collisionItem.type === ElementTypeNames.BONUS_SPEED) {
            this.onActiveBonus(collisionItem as Bonus);
            return;
        }

        switch (this.currentDirection) {
            case DIRECTION_NAMES.UP : {
                this.tankSprite.y += this.speed;
                break;
            }
            case DIRECTION_NAMES.LEFT : {
                this.tankSprite.x += this.speed;
                break;
            }
            case DIRECTION_NAMES.DOWN : {
                this.tankSprite.y -= this.speed;
                break;
            }
            case DIRECTION_NAMES.RIGHT : {
                this.tankSprite.x -= this.speed;
                break;
            }
        }
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public onExplode(): void {
        this.playAnimation();
        this.isKilled = true;
        this.ticker.stop();
        app.mainGameModule.collisionLogic.removeItem(this);
    }

    protected onActiveBonus(bonus: Bonus): void {
        this.currentBonus = bonus;
        bonus.remove()
    }

    public playAnimation() {
        const animation: AnimatedSprite = app.loader.getAnimation(AnimationsNames.EXPLODE_SPRITE);
        animation.anchor.set(0.5);
        animation.x = this.tankSprite.x;
        animation.y = this.tankSprite.y;
        animation.loop = false;
        animation.play();
        app.mapView.addChild(animation);
        animation.onComplete = () => {
            app.mapView.removeChild(animation);
        };
    }

    public setDirection(direction: string): void {
        this.inMove = true;
        this.currentDirection = direction;
        this.updatePossibleCollision();
    }
}

