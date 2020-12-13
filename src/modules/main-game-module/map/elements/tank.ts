import * as PIXI from 'pixi.js';
import Bullet from './bullet';
import { DIRECTION_NAMES, EVENT_NAMES } from '../../../constants';
import { app } from '../../../../index';

export default class Tank {
    protected ticker: PIXI.Ticker;
    protected bullet: Bullet;
    protected type: string;
    protected currentDirection: string;
    protected inMove: boolean;
    public tankSprite: PIXI.Sprite;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        this.tankSprite = new PIXI.Sprite(texture);
        this.tankSprite.x = this.tankSprite.width * j;
        this.tankSprite.y = this.tankSprite.height * i;
        this.tankSprite.anchor.set(0.5);
        this.ticker = new PIXI.Ticker();
        this.ticker.add(() => this.update());
        this.ticker.start();
        this.addListeners();

    }

    private addListeners(): void {
        document.addEventListener(EVENT_NAMES.KEYDOWN, (e: KeyboardEvent) => {
            this.ticker.start();
            this.setKeyDown(e.keyCode);
        });
        document.addEventListener(EVENT_NAMES.KEYUP, (e: KeyboardEvent) => {
            this.ticker.start();
            this.setKeyUP(e.keyCode);
        });
    }

    public update(): void {

        if (!this.inMove) {
            this.ticker.stop();
            return;
        }
        switch (this.currentDirection) {
            case DIRECTION_NAMES.UP : {
                this.tankSprite.y -= 1;
                this.tankSprite.angle = 0;
                break;
            }
            case DIRECTION_NAMES.LEFT : {
                this.tankSprite.x -= 1;
                this.tankSprite.angle = 270;
                break;
            }
            case DIRECTION_NAMES.DOWN : {
                this.tankSprite.y += 1;
                this.tankSprite.angle = 180;
                break;
            }
            case DIRECTION_NAMES.RIGHT : {
                this.tankSprite.x += 1;
                this.tankSprite.angle = 90;
                break;
            }
        }
        const canMove = app.collisionLogic.checkCanMove(this);
        if (!canMove) {
            switch (this.currentDirection) {
                case DIRECTION_NAMES.UP : {
                    this.tankSprite.y += 1;
                    break;
                }
                case DIRECTION_NAMES.LEFT : {
                    this.tankSprite.x += 1;
                    break;
                }
                case DIRECTION_NAMES.DOWN : {
                    this.tankSprite.y -= 1;
                    break;
                }
                case DIRECTION_NAMES.RIGHT : {
                    this.tankSprite.x -= 1;
                    break;
                }
            }
        }
    }

    public setKeyDown(code: number): void {
        switch (code) {
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

    }

    public setKeyUP(code: number): void {

        switch (code) {
            case 32: {
                const x = this.tankSprite.x;
                const y = this.tankSprite.y;
                this.bullet = new Bullet(this.currentDirection, x, y);
                break;
            }
            default: {
                this.inMove = false;
            }
        }
    }

}

