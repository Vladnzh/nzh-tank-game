import * as PIXI from 'pixi.js';
import { app } from '../../../../index';
import { DIRECTION_NAMES, ElementTypeNames } from '../../../constants';

export default class Bullet {
    protected ticker: PIXI.Ticker;
    private OFFSET: number = 23;
    protected type: string;
    protected currentDirection: string;
    public shellSprite: PIXI.Sprite;

    constructor(direction: string, x: number, y: number) {
        const texture = app.loader.getTextureByTypeName(ElementTypeNames.BULLET);
        this.shellSprite = new PIXI.Sprite(texture);
        this.currentDirection = direction;
        this.setPosition(x, y);
        this.shellSprite.anchor.set(0.5);
        this.ticker = new PIXI.Ticker();
        this.ticker.add(() => this.update());
        this.ticker.start();
        app.mapView.addChild(this.shellSprite);
        app.collisionLogic.addBullet(this);
    }

    public stop(): void {
        this.ticker.stop();
    }

    protected setPosition(x: number, y: number) {
        switch (this.currentDirection) {
            case DIRECTION_NAMES.UP : {
                this.shellSprite.x = x;
                this.shellSprite.y = y - this.OFFSET;
                break;
            }
            case DIRECTION_NAMES.LEFT : {
                this.shellSprite.x = x - this.OFFSET;
                this.shellSprite.y = y;
                break;
            }
            case DIRECTION_NAMES.DOWN : {
                this.shellSprite.x = x;
                this.shellSprite.y = y + this.OFFSET;
                break;
            }
            case DIRECTION_NAMES.RIGHT : {
                this.shellSprite.x = x + this.OFFSET;
                this.shellSprite.y = y;
                break;
            }
        }
    }

    public update(): void {
        app.collisionLogic.findBulletCollision(this);

        switch (this.currentDirection) {
            case DIRECTION_NAMES.UP : {
                this.shellSprite.y -= 2.5;
                break;
            }
            case DIRECTION_NAMES.LEFT : {
                this.shellSprite.x -= 2.5;
                break;
            }
            case DIRECTION_NAMES.DOWN : {
                this.shellSprite.y += 2.5;
                break;
            }
            case DIRECTION_NAMES.RIGHT : {
                this.shellSprite.x += 2.5;
                break;
            }
            case null : {
                this.ticker.stop();
                break;
            }
        }
    }
}

