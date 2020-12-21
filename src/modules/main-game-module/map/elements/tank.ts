import * as PIXI from 'pixi.js';
import Bullet from './bullet';
import {
    AnimationsNames,
    DefaultTextureSize,
    DIRECTION_NAMES,
    ElementTypeNames,
    EVENT_NAMES,
} from '../../../constants';
import { app } from '../../../../index';
import Board from './board';
import { TimelineLite } from 'gsap';
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';
import TankEnemy from './tank-enemy';
import { StateNames } from '../../../../state-machine/state-machine-constants';
import { TypeItemsCollision } from '../../../../interfaces';
import { itemsIntersect } from '../../../../utils';
import { v4 as uuidv4 } from 'uuid';
import { AnimatedSprite } from 'pixi.js';
import Bonus from './bonus';

export default class Tank extends PIXI.Container {
    public type: string;
    public id: string;
    public tankSprite: PIXI.Sprite;
    public possibleCollision: Array<TypeItemsCollision>;
    public currentDirection: string;
    public currentBonus: Bonus;
    private RECHARGE_MARK_OFFSET: number = 3.5;
    protected ticker: PIXI.Ticker;
    protected speed: number = 1;
    protected rechargeSpeed: number = 0.2;
    protected rechargeTimeline: TimelineLite;
    protected rechargeMark: PIXI.Graphics;
    protected bullet: Bullet;
    protected inMove: boolean;
    protected isDrown: boolean = false;
    protected inRecharge: boolean = false;
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
        this.ticker.add(() => this.update());
        this.ticker.start();
        this.addListeners();
        this.rechargeMark = new PIXI.Graphics();
        this.rechargeMark.beginFill(0x4df546);
        this.rechargeMark.drawRect(0, 0, this.tankSprite.width, 3);
        this.rechargeMark.endFill();
        this.rechargeMark.alpha = 0.8;
        app.mainGameModule.collisionLogic.addTank(this);
        this.updatePossibleCollision();
        this.rechargeMark.x = this.tankSprite.x - (this.tankSprite.width / 2);
        this.rechargeMark.y = this.tankSprite.y + (this.tankSprite.height / 2);
        this.addChild(this.tankSprite);
        this.addChild(this.rechargeMark);
    }

    private addListeners(): void {
        document.addEventListener(EVENT_NAMES.KEYDOWN, this.setKeyDown.bind(this));
        document.addEventListener(EVENT_NAMES.KEYUP, this.setKeyUp.bind(this));
    }

    private removeListeners(): void {
        document.removeEventListener(EVENT_NAMES.KEYDOWN, this.setKeyDown.bind(this));
        document.removeEventListener(EVENT_NAMES.KEYUP, this.setKeyUp.bind(this));
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
        const collisionItem = this.possibleCollision?.find((item: TypeItemsCollision) => itemsIntersect(this, item));
        if (collisionItem) {
            this.onCollisionHappened(collisionItem);
        }
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

    public onExplode(): void {
        this.playAnimation();
        this.isKilled = true;
        this.ticker.stop();
        app.mainGameModule.collisionLogic.removeItem(this);
        this.removeListeners();
        app.stateMachine.changeState(StateNames.END_GAME_STATE);
    }

    public updatePossibleCollision() {
        this.possibleCollision = app.mainGameModule.collisionLogic.findTankPossibleCollision(this);
    }

    protected onCollisionHappened(collisionItem: TypeItemsCollision): void {
        if (collisionItem.type === ElementTypeNames.BONUS_SLOW
            || collisionItem.type === ElementTypeNames.BONUS_LIVE
            || collisionItem.type === ElementTypeNames.BONUS_IMMORTAL
            || collisionItem.type === ElementTypeNames.BONUS_SPEED) {
            this.onActiveBonus(collisionItem as Bonus);
            return;
        }

        if (collisionItem.type === ElementTypeNames.WATER) {
            this.onDrown(collisionItem);
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
            app.stateMachine.changeState(StateNames.END_GAME_STATE);
        });
    }


    protected onRecharge(): void {
        this.rechargeMark.width = 0;
        this.rechargeMark.filters = [new ColorOverlayFilter(0xf53834)];
        this.inRecharge = true;
        this.rechargeTimeline = new TimelineLite();
        this.rechargeTimeline.to(this.rechargeMark, this.rechargeSpeed, {
            width: this.tankSprite.width,
        });
        this.rechargeTimeline.add(() => {
            this.rechargeTimeline = null;
            this.rechargeMark.filters = [];
            this.inRecharge = false;
        });
    }

    protected onActiveBonus(bonus: Bonus): void {
        this.currentBonus = bonus;
        bonus.remove()
    }

    public setKeyDown(e: KeyboardEvent): void {
        this.ticker.start();
        switch (e.keyCode) {
            case 87 || 38 : {
                this.inMove = true;
                this.currentDirection = DIRECTION_NAMES.UP;
                break;
            }
            case 65 || 37 : {
                this.inMove = true;
                this.currentDirection = DIRECTION_NAMES.LEFT;
                break;
            }
            case 83 || 40 : {
                this.inMove = true;
                this.currentDirection = DIRECTION_NAMES.DOWN;
                break;
            }
            case 68 || 39 : {
                this.inMove = true;
                this.currentDirection = DIRECTION_NAMES.RIGHT;
                break;
            }
        }
        this.updatePossibleCollision();

    }

    public setKeyUp(e: KeyboardEvent): void {
        this.ticker.start();
        switch (e.keyCode) {
            case 32: {
                if (this.inRecharge) {
                    return;
                }
                this.onRecharge();
                const x = this.tankSprite.x;
                const y = this.tankSprite.y;
                this.bullet = new Bullet(ElementTypeNames.BULLET, this.currentDirection, x, y);
                break;
            }
            default: {
                this.inMove = false;
            }
        }
    }

}

