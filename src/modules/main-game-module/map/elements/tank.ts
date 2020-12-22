import * as PIXI from 'pixi.js';
import Bullet from './bullet';
import {
    DIRECTION_NAMES,
    ElementTypeNames,
    EVENT_NAMES,
} from '../../../constants';
import { app } from '../../../../index';
import Board from './board';
import { TimelineLite } from 'gsap';
import { StateNames } from '../../../../state-machine/state-machine-constants';
import { TypeItemsCollision } from '../../../../interfaces';
import { AbstractTank } from './abstract-tank';

export default class Tank extends AbstractTank {

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super(texture, type, i, j);
        this.addListeners();
    }

    private addListeners(): void {
        document.addEventListener(EVENT_NAMES.KEYDOWN, this.setKeyDown.bind(this));
        document.addEventListener(EVENT_NAMES.KEYUP, this.setKeyUp.bind(this));
    }

    private removeListeners(): void {
        document.removeEventListener(EVENT_NAMES.KEYDOWN, this.setKeyDown.bind(this));
        document.removeEventListener(EVENT_NAMES.KEYUP, this.setKeyUp.bind(this));
    }

    public onExplode(): void {
        if (!this.isDrown) {
            super.onExplode();
        }
        this.removeListeners();
        app.stateMachine.changeState(StateNames.END_GAME_STATE);
    }

    protected onCollisionHappened(collisionItem: TypeItemsCollision): void {
        if (collisionItem.type === ElementTypeNames.WATER) {
            this.onDrown(collisionItem as Board);
            return;
        }
        super.onCollisionHappened(collisionItem);
    }

    public onDrown(water: Board): void {
        this.isDrown = true;
        this.removeChild(this.rechargeMark);
        const tl = new TimelineLite;
        tl.to(this.tankSprite, 1.5, {
            x: water.x + water.width / 2,
            y: water.y + water.height / 2,
        });
        tl.to(this.tankSprite.scale, 1, {
            x: 0,
            y: 0,
        });
        tl.add(() => {
            this.tankSprite.visible = false;
            this.onExplode();
        });
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

