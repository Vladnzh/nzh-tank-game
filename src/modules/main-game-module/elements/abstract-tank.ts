import * as PIXI from 'pixi.js';
import Bonus from './bonus';
import {
    AnimationsNames,
    DefaultParams,
    DefaultTextureSize,
    DIRECTION_NAMES,
    ElementTypeNames,
} from '../../constants';
import { TimelineLite, TweenMax } from 'gsap';
import { TypeItemsCollision } from '../../../interfaces';
import Bullet from './bullet';
import { v4 as uuidv4 } from 'uuid';
import { itemsIntersect } from '../../../utils';
import { app } from '../../../index';
import { AnimatedSprite } from 'pixi.js';
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';

export class AbstractTank extends PIXI.Container {
    public type: string;
    public id: string;
    public tankSprite: PIXI.Sprite;
    public possibleCollision: Array<TypeItemsCollision>;
    public currentDirection: string;
    public currentBonusType: string;
    private RECHARGE_MARK_OFFSET: number = 3.5;
    protected ticker: PIXI.Ticker;
    protected amountLife: number;
    protected speed: number;
    protected rechargeTime: number;
    protected rechargeTimeline: TimelineLite;
    protected rechargeMark: PIXI.Graphics;
    protected bullet: Bullet;
    protected inMove: boolean;
    protected isDrown: boolean = false;
    protected inRecharge: boolean = false;
    protected isKilled: boolean = false;
    protected isImmortal: boolean = false;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super();
        this.type = type;
        this.id = uuidv4();
        this.setSpeed(DefaultParams.TANK_SPEED);
        this.rechargeTime = DefaultParams.RECHARGE_TIME;
        this.amountLife = DefaultParams.AMOUNT_LIFE;
        this.tankSprite = new PIXI.Sprite(texture);
        this.tankSprite.x = DefaultTextureSize.WIDTH * j + DefaultTextureSize.WIDTH / 2;
        this.tankSprite.y = DefaultTextureSize.HEIGHT * i + DefaultTextureSize.HEIGHT / 2;
        this.tankSprite.anchor.set(0.5);
        this.rechargeMark = new PIXI.Graphics();
        this.rechargeMark.beginFill(0x4df546);
        this.rechargeMark.drawRect(0, 0, this.tankSprite.width, 3);
        this.rechargeMark.endFill();
        this.rechargeMark.alpha = 0.8;
        app.ticker.add(this.update, this);
        app.mainGameModule.collisionLogic.addTank(this);
        this.rechargeMark.x = this.tankSprite.x - (this.tankSprite.width / 2);
        this.rechargeMark.y = this.tankSprite.y + (this.tankSprite.height / 2);
        this.addChild(this.tankSprite);
        this.addChild(this.rechargeMark);
        this.updatePossibleCollision();
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public update(): void {
        if (this.isDrown) {
            return;
        }
        if (!this.inMove) {
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
        const collisionItem = this.possibleCollision?.find((item: TypeItemsCollision) =>
            itemsIntersect(this, item));
        if (collisionItem) {
            this.onCollisionHappened(collisionItem);
        }
    }


    protected checkBonus(collisionItem: TypeItemsCollision): void {
        if (collisionItem.type === ElementTypeNames.BONUS_SLOW
            || collisionItem.type === ElementTypeNames.BONUS_LIVE
            || collisionItem.type === ElementTypeNames.BONUS_IMMORTAL
            || collisionItem.type === ElementTypeNames.BONUS_SPEED) {
            this.onActiveBonus(collisionItem as Bonus);
            return;
        }
    }

    public onExplode(): void {
        if (this.amountLife) {
            this.amountLife--;
            return;
        }
        this.playExplodeAnimation();
        this.isKilled = true;
        app.mainGameModule.collisionLogic.removeItem(this);
        app.mainGameView.removeChild(this);
    }

    public playExplodeAnimation() {
        const animation: AnimatedSprite = app.loader.getAnimation(AnimationsNames.EXPLODE_SPRITE);
        animation.anchor.set(0.5);
        animation.x = this.tankSprite.x;
        animation.y = this.tankSprite.y;
        animation.loop = false;
        animation.play();
        app.mainGameView.addChild(animation);
        animation.onComplete = () => {
            app.mainGameView.removeChild(animation);
            app.ticker.remove(this.update, this);
        };
    }

    protected onActiveBonus(bonus: Bonus): void {
        this.currentBonusType = bonus.type;
        let delay: number = DefaultParams.BONUS_EXPIRATION_TIME;
        if (this.currentBonusType === ElementTypeNames.BONUS_SPEED) {
            this.setSpeed(DefaultParams.TANK_SPEED * 2);
        }
        if (this.currentBonusType === ElementTypeNames.BONUS_SLOW) {
            this.setSpeed(DefaultParams.TANK_SPEED * 2);
        }
        if (this.currentBonusType === ElementTypeNames.BONUS_LIVE && this.amountLife <= 3) {
            this.amountLife++;
        }
        if (this.currentBonusType === ElementTypeNames.BONUS_IMMORTAL) {
            this.isImmortal = true;
            delay = DefaultParams.BONUS_IMMORTAL_EXPIRATION_TIME;
        }
        TweenMax.delayedCall(delay, () => this.onDisActiveBonus());
        bonus.remove();
    }

    protected onDisActiveBonus(): void {
        if (this.currentBonusType === ElementTypeNames.BONUS_SPEED
            || this.currentBonusType === ElementTypeNames.BONUS_SLOW) {
            this.setSpeed(DefaultParams.TANK_SPEED);
        }
        if (this.currentBonusType === ElementTypeNames.BONUS_IMMORTAL) {
            this.isImmortal = false;
        }
        this.currentBonusType = null;
    }

    protected onCollisionHappened(collisionItem: TypeItemsCollision): void {
        this.checkBonus(collisionItem);
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

    protected onRecharge(): void {
        this.rechargeMark.width = 0;
        this.rechargeMark.filters = [new ColorOverlayFilter(0xf53834)];
        this.inRecharge = true;
        this.rechargeTimeline = new TimelineLite();
        this.rechargeTimeline.to(this.rechargeMark, this.rechargeTime, {
            width: this.tankSprite.width,
        });
        this.rechargeTimeline.add(() => {
            this.rechargeTimeline = null;
            this.rechargeMark.filters = [];
            this.inRecharge = false;
        });
    }

    public updatePossibleCollision(): void {
        this.possibleCollision = app.mainGameModule.collisionLogic.findTankPossibleCollision(this);
    }
    public remove(){
        app.ticker.remove(this.update, this)
    }

}
