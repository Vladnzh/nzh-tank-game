import * as PIXI from 'pixi.js';
import Bullet from './bullet';
import { DIRECTION_NAMES, ElementTypeNames, EVENT_NAMES } from '../../../constants';
import { app } from '../../../../index';
import Board from './board';
import { TimelineLite } from 'gsap';

export default class Tank {
    private WIDTH_OFFSET: number = 11.5;
    private HEIGHT_OFFSET: number = 4.9;
    protected ticker: PIXI.Ticker;
    protected speed: number = 1;
    protected bullet: Bullet;
    protected type: string;
    protected currentDirection: string;
    protected inMove: boolean;
    protected isLock: boolean = false;
    public tankSprite: PIXI.Sprite;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        this.tankSprite = new PIXI.Sprite(texture);
        this.tankSprite.x = (this.tankSprite.width + this.WIDTH_OFFSET) * j;
        this.tankSprite.y = (this.tankSprite.height + this.HEIGHT_OFFSET) * i;
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
        if (this.isLock) {
            return;
        }
        if (!this.inMove) {
            this.ticker.stop();
            return;
        }

        switch (this.currentDirection) {
            case DIRECTION_NAMES.UP : {
                this.tankSprite.y -= this.speed;
                this.tankSprite.angle = 0;
                break;
            }
            case DIRECTION_NAMES.LEFT : {
                this.tankSprite.x -= this.speed;
                this.tankSprite.angle = 270;
                break;
            }
            case DIRECTION_NAMES.DOWN : {
                this.tankSprite.y += this.speed;
                this.tankSprite.angle = 180;
                break;
            }
            case DIRECTION_NAMES.RIGHT : {
                this.tankSprite.x += this.speed;
                this.tankSprite.angle = 90;
                break;
            }
        }
        const collisionBoard: Board = app.collisionLogic.findTankCollision(this);
        this.setSpeed(1);
        if (collisionBoard) {
            this.onCollisionHappened(collisionBoard);
        }
    }

    protected onCollisionHappened(collisionBoard: Board): void {
        if (collisionBoard.type === ElementTypeNames.WATER) {
            this.onDrown(collisionBoard);
            return;
        }
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

    public onDrown(board: Board): void {
        this.isLock = true;
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

