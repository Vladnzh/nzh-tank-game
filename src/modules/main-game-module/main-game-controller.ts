import { TweenMax } from 'gsap';
import MapController from './map-controller';
import { Container } from 'pixi.js';
import { app } from '../../index';
import Bonus from './elements/bonus';
import Tank from './elements/tank';
import { TypeItemsCollision } from '../../interfaces';
import Bullet from './elements/bullet';
import { DIRECTION_NAMES, ElementTypeNames, EVENT_NAMES } from '../constants';
import Board from './elements/board';
import { AbstractTank } from './elements/abstract-tank';
import _ from 'lodash';
import { isIgnoreTypeForBullet, isIgnoreTypeForTank, isAnyTank } from '../../utils';
import { StateNames } from '../../state-machine/state-machine-constants';

export default class MainGameController {
    protected OFFSET_TANK_POSSIBLE_COLLISION: number = 15;
    protected OFFSET_BULLET_POSSIBLE_COLLISION: number = 10;
    public view: Container;
    public map: MapController;
    public currentBonusOnMap: Bonus;
    public ownTank: Tank;
    public amountEnemyTanks: number = 0;
    protected itemsForCollision: Array<TypeItemsCollision> = [];
    protected bullets: Array<Bullet> = [];

    constructor() {
        this.view = new Container();
        this.view.name = 'mainGame';
        this.map = new MapController(this.view);
        app.stage.addChild(this.view);
    }

    public drawView(): void {
        this.map.createMap();
        this.map.createLife(this.ownTank.amountLife);
    }

    public showView(): void {
        this.amountEnemyTanks = 0;
        this.currentBonusOnMap = null;
        this.itemsForCollision = [];
        this.bullets = [];
        this.drawView();
        this.view.alpha = 0;
        this.view.visible = true;
        TweenMax.to(this.view, 1, {
            alpha: 1,
        });
    }

    public hideView(): void {
        TweenMax.to(this.view, 1, {
            alpha: 0,
            onComplete: () => {
                this.view.visible = false;
                app.stage.removeChild(this.view);
            },
        });
    }

    private addListeners(): void {
        document.addEventListener(EVENT_NAMES.KEYDOWN, (e: KeyboardEvent) => this.ownTank.setKeyDown(e));
        document.addEventListener(EVENT_NAMES.KEYUP, (e: KeyboardEvent) => this.ownTank.setKeyUp(e));
    }

    public addBoard(board: Board) {
        this.itemsForCollision.push(board);
    }

    public addTank(tank: AbstractTank) {
        if (tank.type === ElementTypeNames.TANK) {
            this.ownTank = tank as Tank;
            this.addListeners();
        } else {
            this.amountEnemyTanks++;
        }
        this.itemsForCollision.push(tank);
    }

    public addBonus(bonus: Bonus) {
        this.currentBonusOnMap = bonus;
        this.itemsForCollision.push(bonus);
    }

    public removeBonus(bonus: Bonus) {
        this.currentBonusOnMap = null;
        this.removeItem(bonus);
    }

    public addBullet(bullet: Bullet) {
        this.bullets.push(bullet);
    }

    public removeBullet(bullet: Bullet) {
        _.remove(this.bullets, (item: Bullet) => item?.id === bullet?.id);
    }

    public removeItem(collisionItem: TypeItemsCollision) {
        if (collisionItem.type === ElementTypeNames.EAGLE) {
            (collisionItem as Board).remove();
            this.ownTank.amountLife = 0;
            this.ownTank.onExplode();
        }
        if (collisionItem.type === ElementTypeNames.WALL) {
            return;
        }
        if (collisionItem.type === ElementTypeNames.SMALL_WALL) {
            (collisionItem as Board).remove();
        }
        if (isAnyTank(collisionItem)) {
            this.amountEnemyTanks--;
            if (!this.amountEnemyTanks) {
                app.stateMachine.changeState(StateNames.END_GAME_STATE);
            }
        }
        _.remove(this.itemsForCollision, (item: TypeItemsCollision) => item?.id === collisionItem?.id);
    }

    public findBulletPossibleCollision(bullet: Bullet) {
        const collision: any = this.itemsForCollision.filter((item: TypeItemsCollision) => {
            let x = item.x;
            let y = item.y;
            let width = item.width;
            let height = item.height;

            if (isAnyTank(item)) {
                x = (item as AbstractTank).tankSprite.x;
                y = (item as AbstractTank).tankSprite.y;
                width = (item as AbstractTank).width;
                height = (item as AbstractTank).height;
            }
            switch (bullet.currentDirection) {
                case DIRECTION_NAMES.UP : {
                    return y < bullet.bulletSprite.y
                        && x + width + this.OFFSET_BULLET_POSSIBLE_COLLISION > bullet.bulletSprite.x
                        && x < bullet.bulletSprite.x + bullet.bulletSprite.width + this.OFFSET_BULLET_POSSIBLE_COLLISION
                        && !isIgnoreTypeForBullet(item.type);
                }
                case DIRECTION_NAMES.LEFT : {
                    return x < bullet.bulletSprite.x
                        && y + height + this.OFFSET_BULLET_POSSIBLE_COLLISION > bullet.bulletSprite.y
                        && y < bullet.bulletSprite.y + bullet.bulletSprite.height + this.OFFSET_BULLET_POSSIBLE_COLLISION
                        && !isIgnoreTypeForBullet(item.type);
                }
                case DIRECTION_NAMES.DOWN : {
                    return y > bullet.bulletSprite.y
                        && x + width + this.OFFSET_BULLET_POSSIBLE_COLLISION > bullet.bulletSprite.x
                        && x < bullet.bulletSprite.x + bullet.bulletSprite.width + this.OFFSET_BULLET_POSSIBLE_COLLISION
                        && !isIgnoreTypeForBullet(item.type);
                }
                case DIRECTION_NAMES.RIGHT : {
                    return x > bullet.bulletSprite.x
                        && y + height + this.OFFSET_BULLET_POSSIBLE_COLLISION > bullet.bulletSprite.y
                        && y < bullet.bulletSprite.y + bullet.bulletSprite.height + this.OFFSET_BULLET_POSSIBLE_COLLISION
                        && !isIgnoreTypeForBullet(item.type);
                }
            }
        });
        return collision;
    }

    public findTankPossibleCollision(tank: AbstractTank) {
        const collision: any = this.itemsForCollision.filter((item: TypeItemsCollision) => {
            let x = item.x;
            let y = item.y;
            let width = item.width;
            let height = item.height;

            if (isAnyTank(item)) {
                x = (item as AbstractTank).tankSprite.x;
                y = (item as AbstractTank).tankSprite.y;
                width = (item as AbstractTank).width;
                height = (item as AbstractTank).height;
            }
            switch (tank.currentDirection) {
                case DIRECTION_NAMES.UP : {
                    return y < tank.tankSprite.y - tank.tankSprite.height
                        && x + width + this.OFFSET_TANK_POSSIBLE_COLLISION > tank.tankSprite.x
                        && x < tank.tankSprite.x + tank.tankSprite.width + this.OFFSET_TANK_POSSIBLE_COLLISION
                        && !isIgnoreTypeForTank(item.type);
                }
                case DIRECTION_NAMES.LEFT : {
                    return x < tank.tankSprite.x - tank.tankSprite.width
                        && y + height + this.OFFSET_TANK_POSSIBLE_COLLISION > tank.tankSprite.y
                        && y < tank.tankSprite.y + tank.tankSprite.width + this.OFFSET_TANK_POSSIBLE_COLLISION
                        && !isIgnoreTypeForTank(item.type);
                }
                case DIRECTION_NAMES.DOWN : {
                    return y > tank.tankSprite.y - tank.tankSprite.height
                        && x + width + this.OFFSET_TANK_POSSIBLE_COLLISION > tank.tankSprite.x
                        && x < tank.tankSprite.x + tank.tankSprite.width
                        && !isIgnoreTypeForTank(item.type);
                }
                case DIRECTION_NAMES.RIGHT : {
                    return x > tank.tankSprite.x - tank.tankSprite.width
                        && y + height + this.OFFSET_TANK_POSSIBLE_COLLISION > tank.tankSprite.y
                        && y < tank.tankSprite.y + tank.tankSprite.width + this.OFFSET_TANK_POSSIBLE_COLLISION
                        && !isIgnoreTypeForTank(item.type);
                }
            }
        });
        return collision;
    }

    public reset() {
        _.forEach(this.itemsForCollision, (item: TypeItemsCollision) => {
            if (isAnyTank(item)) {
                (item as AbstractTank).remove();
            }
        });
    }
}
