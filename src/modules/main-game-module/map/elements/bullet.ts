import * as PIXI from 'pixi.js';
import { app } from '../../../../index';
import { AnimationsNames, DIRECTION_NAMES, ElementTypeNames } from '../../../constants';
import { AnimatedSprite } from 'pixi.js';
import { TypeItemsCollision } from '../../../../interfaces';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import TankEnemy from './tank-enemy';
import Tank from './tank';
import { StateNames } from '../../../../state-machine/state-machine-constants';

export default class Bullet {
    public id: string;
    protected ticker: PIXI.Ticker;
    protected speed: number = 5;
    private OFFSET: number = 15;
    protected type: string;
    public currentDirection: string;
    public bulletSprite: PIXI.Sprite;
    public possibleCollision: Array<TypeItemsCollision>;

    constructor(textureTypeName: string, direction: string, x: number, y: number) {
        this.id = uuidv4();
        this.type = textureTypeName;
        const texture = app.loader.getTextureByTypeName(textureTypeName);
        this.bulletSprite = new PIXI.Sprite(texture);
        this.currentDirection = direction;
        this.setPosition(x, y);
        this.bulletSprite.anchor.set(0.5);
        this.ticker = new PIXI.Ticker();
        this.ticker.add(() => this.update());
        this.ticker.start();
        app.mapView.addChild(this.bulletSprite);
        app.mainGameModule.collisionLogic.addBullet(this);
        this.updatePossibleCollision();
    }

    public updatePossibleCollision() {
        this.possibleCollision = app.mainGameModule.collisionLogic.findBulletPossibleCollision(this);
    }


    protected setPosition(x: number, y: number) {
        switch (this.currentDirection) {
            case DIRECTION_NAMES.UP : {
                this.bulletSprite.x = x;
                this.bulletSprite.y = y - this.OFFSET;
                break;
            }
            case DIRECTION_NAMES.LEFT : {
                this.bulletSprite.x = x - this.OFFSET;
                this.bulletSprite.y = y;
                break;
            }
            case DIRECTION_NAMES.DOWN : {
                this.bulletSprite.x = x;
                this.bulletSprite.y = y + this.OFFSET;
                break;
            }
            case DIRECTION_NAMES.RIGHT : {
                this.bulletSprite.x = x + this.OFFSET;
                this.bulletSprite.y = y;
                break;
            }
        }
    }

    public playAnimation() {
        const animation: AnimatedSprite = app.loader.getAnimation(AnimationsNames.EXPLODE_SMALL_SPRITE);
        animation.anchor.set(0.5);
        animation.x = this.bulletSprite.x;
        animation.y = this.bulletSprite.y;
        animation.loop = false;
        animation.play();
        app.mapView.addChild(animation);
        animation.onComplete = () => {
            app.mapView.removeChild(animation);
        };
    }

    private itemsIntersect(a: any, b: any): boolean {
        if (!a || !b) {
            return false;
        }
        if (a.type === b.type) {
            return false;
        }
        const ab = a.getBounds();
        const bb = b.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    public onExplode(): void {
        this.playAnimation();
        app.mainGameModule.collisionLogic.removeBullet(this);
        this.ticker.stop();
    }

    protected onCollisionHappened(collisionItem: TypeItemsCollision): void {
        if ((collisionItem.type === ElementTypeNames.TANK_ENEMY_RED
            || collisionItem.type === ElementTypeNames.TANK_ENEMY_BLUE
            || collisionItem.type === ElementTypeNames.TANK_ENEMY_WHITE)
            && this.type !== ElementTypeNames.BULLET_ENEMY) {
            (collisionItem as TankEnemy).onExplode();
        }
        if (collisionItem.type === ElementTypeNames.TANK) {
            (collisionItem as Tank).onExplode();
        }
        if (collisionItem.type === ElementTypeNames.SMALL_WALL) {
            app.mainGameModule.collisionLogic.removeItem(collisionItem);
        }
        if (collisionItem.type === ElementTypeNames.EAGLE) {
            app.mainGameModule.collisionLogic.removeItem(collisionItem);
            app.stateMachine.changeState(StateNames.END_GAME_STATE);
        }
        this.onExplode();
    }

    public update(): void {
        _.throttle(() => this.updatePossibleCollision(), 100);
        const collisionItem = this.possibleCollision.find((item: TypeItemsCollision) =>
            this.itemsIntersect(this.bulletSprite, item));

        if (collisionItem) {
            this.onCollisionHappened(collisionItem);
        }

        switch (this.currentDirection) {
            case DIRECTION_NAMES.UP : {
                this.bulletSprite.y -= this.speed;
                break;
            }
            case DIRECTION_NAMES.LEFT : {
                this.bulletSprite.x -= this.speed;
                break;
            }
            case DIRECTION_NAMES.DOWN : {
                this.bulletSprite.y += this.speed;
                break;
            }
            case DIRECTION_NAMES.RIGHT : {
                this.bulletSprite.x += this.speed;
                break;
            }
            case null : {
                this.ticker.stop();
                break;
            }
        }
    }
}

