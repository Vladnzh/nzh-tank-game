import * as PIXI from 'pixi.js';
import { app } from '../../index';
import { LoaderResourceNames } from '../../loader-module/constants/loader-constants';

export default class BulletController {
    protected ticker: PIXI.Ticker;
    private OFFSET: number = 23;
    protected type: string;
    protected currentDirection: string;
    public shellSprite: PIXI.Sprite;

    constructor(direction: string, x: number, y: number) {
        this.shellSprite = new PIXI.Sprite(app.loader.resources[LoaderResourceNames.BULLET].texture);
        this.currentDirection = direction;
        this.setPosition(x, y);
        this.shellSprite.anchor.set(0.5);
        this.ticker = new PIXI.Ticker();
        this.ticker.add(() => this.update());
        this.ticker.start();
        app.mapView.addChild(this.shellSprite);
    }

    protected setPosition(x: number, y: number) {
        switch (this.currentDirection) {
            case 'UP' : {
                this.shellSprite.x = x;
                this.shellSprite.y = y - this.OFFSET;
                break;
            }
            case 'LEFT' : {
                this.shellSprite.x = x - this.OFFSET;
                this.shellSprite.y = y;
                break;
            }
            case 'DOWN' : {
                this.shellSprite.x = x;
                this.shellSprite.y = y + this.OFFSET;
                break;
            }
            case 'RIGHT' : {
                this.shellSprite.x = x + this.OFFSET;
                this.shellSprite.y = y;
                break;
            }
        }
    }

    public update(): void {
        switch (this.currentDirection) {
            case 'UP' : {
                this.shellSprite.y -= 2.5;
                break;
            }
            case 'LEFT' : {
                this.shellSprite.x -= 2.5;
                break;
            }
            case 'DOWN' : {
                this.shellSprite.y += 2.5;
                break;
            }
            case 'RIGHT' : {
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

