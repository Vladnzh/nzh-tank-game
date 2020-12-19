import * as PIXI from 'pixi.js';
import Bullet from './bullet';
import { AnimationsNames, DefaultTextureSize, DIRECTION_NAMES, ElementTypeNames } from '../../../constants';
import { app } from '../../../../index';
import Board from './board';
import { TimelineLite } from 'gsap';
import Tank from './tank';
import { AnimatedSprite } from 'pixi.js';
import { TypeItemsCollision } from '../../../../interfaces';
import { itemsIntersect } from '../../../../utils';
import { TweenMax } from 'gsap';
import _ from 'lodash';

export default class TankEnemy extends PIXI.Container {
    public type: string;
    public id: string;
    private RECHARGE_MARK_OFFSET: number = 3.5;
    protected ticker: PIXI.Ticker;
    protected speed: number = 1;
    protected bullet: Bullet;
    public currentDirection: string;
    protected rechargeMark: PIXI.Graphics;
    protected inMove: boolean;
    protected isDrown: boolean = false;
    public tankSprite: PIXI.Sprite;
    public possibleCollision: Array<TypeItemsCollision>;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super();
        this.type = type;
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

    }

    protected loop(): void {
        const directions: Array<string> = [DIRECTION_NAMES.LEFT, DIRECTION_NAMES.RIGHT, DIRECTION_NAMES.DOWN, DIRECTION_NAMES.UP];
        this.bullet = new Bullet(this.currentDirection, this.tankSprite.x, this.tankSprite.y);
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

    protected onCollisionHappened(collisionBoard: Board | Tank | TankEnemy): void {
        // if (collisionBoard.type === ElementTypeNames.WATER) {
        //     this.onDrown(collisionBoard);
        //     return;
        // }

        if (collisionBoard.type === ElementTypeNames.LEAVES) {
            this.setSpeed(this.speed / 2);
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

    public onDrown(board: Board | Tank | TankEnemy): void {
        this.isDrown = true;
        this.removeChild(this.rechargeMark);
        const tl = new TimelineLite;
        tl.to(this.tankSprite, 1.5, {
            x: board.x + board.width / 2,
            y: board.y + board.height / 2,
        });
        tl.to(this.tankSprite.scale, 1, {
            x: 0,
            y: 0,
        });
        tl.add(() => {
            this.tankSprite.visible = false;
        });
    }

    public onExplode(): void {
        this.playAnimation();
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
        this.updatePossibleCollision()
    }
}

