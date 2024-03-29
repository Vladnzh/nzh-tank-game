import * as PIXI from 'pixi.js';
import Bullet from './bullet';
import {
    DIRECTION_NAMES,
    ElementTypeNames,
} from '../../constants';
import { TweenMax } from 'gsap';
import _ from 'lodash';
import { AbstractTank } from './abstract-tank';
import { app } from '../../../index';

export default class TankEnemy extends AbstractTank {
    protected DIRECTIONS: Array<string> = [DIRECTION_NAMES.LEFT, DIRECTION_NAMES.RIGHT, DIRECTION_NAMES.DOWN, DIRECTION_NAMES.UP];
    protected loopCaller: TweenMax;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super(texture, type, i, j);
        this.removeChild(this.rechargeMark);
        this.loop();
    }

    protected loop(): void {
        if (this.isKilled) {
            return;
        }
        if (!app.isPause) {
            this.onRecharge();
            this.setDirection(this.DIRECTIONS[_.random(0, this.DIRECTIONS.length)]);
        }

        this.loopCaller = TweenMax.delayedCall(_.random(1, 1.5), () => this.loop());
    }

    protected setDirection(direction: string): void {
        this.inMove = true;
        this.currentDirection = direction;
        this.updatePossibleCollision();
    }

    protected onRecharge(): void {
        super.onRecharge();
        const x = this.tankSprite.x;
        const y = this.tankSprite.y;
        this.bullet = new Bullet(ElementTypeNames.BULLET_ENEMY, this.currentDirection, x, y);
    }

    public remove(): void {
        this.loopCaller.kill();
        super.remove();
    }
}

