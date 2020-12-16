import * as PIXI from 'pixi.js';
import { app } from '../../../../index';
import { AnimationsNames, DIRECTION_NAMES, ElementTypeNames } from '../../../constants';
import { AnimatedSprite } from 'pixi.js';

export default class Bullet {
    protected ticker: PIXI.Ticker;
    protected speed: number = 3;
    private OFFSET: number = 23;
    protected type: string;
    protected currentDirection: string;
    public bulletSprite: PIXI.Sprite;

    constructor(direction: string, x: number, y: number) {
        const texture = app.loader.getTextureByTypeName(ElementTypeNames.BULLET);
        this.bulletSprite = new PIXI.Sprite(texture);
        this.currentDirection = direction;
        this.setPosition(x, y);
        this.bulletSprite.anchor.set(0.5);
        this.ticker = new PIXI.Ticker();
        this.ticker.add(() => this.update());
        this.ticker.start();
        app.mapView.addChild(this.bulletSprite);
        app.mainGameModule.collisionLogic.addBullet(this);
    }

    public stop(): void {
        this.ticker.stop();
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

    public update(): void {
        app.mainGameModule.collisionLogic.findBulletCollision(this);
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

