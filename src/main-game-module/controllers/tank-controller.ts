import * as PIXI from 'pixi.js';
import BulletController from './bullet-controller';

export default class TankController {
    protected ticker: PIXI.Ticker;
    protected bullet: BulletController;
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
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.ticker.start();
            this.setKeyDown(e.keyCode);
        });
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.setKeyUP(e.keyCode);
        });

    }

    public update(): void {
        if (!this.inMove) {
            this.ticker.stop();
            return;
        }
        switch (this.currentDirection) {
            case 'UP' : {
                this.tankSprite.y -= 1;
                this.tankSprite.angle = 0;
                break;
            }
            case 'LEFT' : {
                this.tankSprite.x -= 1;
                this.tankSprite.angle = 270;
                break;
            }
            case 'DOWN' : {
                this.tankSprite.y += 1;
                this.tankSprite.angle = 180;
                break;
            }
            case 'RIGHT' : {
                this.tankSprite.x += 1;
                this.tankSprite.angle = 90;
                break;
            }
        }
    }

    public setKeyDown(code: number): void {
        switch (code) {
            case 87 || 38 : {
                this.inMove = true;
                this.currentDirection = 'UP';
                break;
            }

            case 65 || 37 : {
                this.inMove = true;
                this.currentDirection = 'LEFT';
                break;
            }

            case 83 || 40 : {
                this.inMove = true;
                this.currentDirection = 'DOWN';
                break;
            }

            case 68 || 39 : {
                this.inMove = true;
                this.currentDirection = 'RIGHT';
                break;
            }
        }
    }

    public setKeyUP(code: number): void {

        switch (code) {
            case 32: {
                const x = this.tankSprite.x;
                const y = this.tankSprite.y;
                this.bullet = new BulletController(this.currentDirection, x, y);
                break;
            }
            default: {
                this.inMove = false;
            }
        }
    }

}

