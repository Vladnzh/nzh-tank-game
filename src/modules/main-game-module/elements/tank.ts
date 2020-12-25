import Bullet from './bullet';
import {
    DefaultParams,
    DIRECTION_NAMES,
    ElementTypeNames,
} from '../../constants';
import Board from './board';
import { TimelineLite } from 'gsap';
import { TypeItemsCollision } from '../../../interfaces';
import { AbstractTank } from './abstract-tank';
import { StateNames } from '../../../state-machine/state-machine-constants';
import { app } from '../../../index';
import Bonus from './bonus';

export default class Tank extends AbstractTank {

    public onExplode() {
        if (this.amountLife) {
            app.mainGameModule.map.lifeSprites[this.amountLife].visible = false;
        }
        super.onExplode();
        if (this.isKilled) {
            app.stateMachine.changeState(StateNames.END_GAME_STATE);
        }
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
        this.amountLife = 0;
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

    protected onActiveBonus(bonus: Bonus): void {
        super.onActiveBonus(bonus);
        if (this.currentBonusType === ElementTypeNames.BONUS_LIVE && this.amountLife <= DefaultParams.MAX_AMOUNT_LIFE) {
            app.mainGameModule.map.lifeSprites[this.amountLife].visible = true;
        }
    }

    public setKeyDown(e: KeyboardEvent): void {
        if (this.isKilled || app.isPause) {
            return;
        }
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
    }

    protected update(): void {
        if (app.isPause) {
            return;
        }
        this.updatePossibleCollision();
        super.update();
    }

    public setKeyUp(e: KeyboardEvent): void {
        if (this.isKilled || app.isPause) {
            return;
        }
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

