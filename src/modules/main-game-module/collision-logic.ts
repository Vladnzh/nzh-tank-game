import Board from './map/elements/board';
import Tank from './map/elements/tank';
import Bullet from './map/elements/bullet';
import _ from 'lodash';
import { app } from '../../index';
import { DIRECTION_NAMES, ElementTypeNames } from '../constants';
import TankEnemy from './map/elements/tank-enemy';
import { TypeItemsCollision } from '../../interfaces';
import Bonus from './map/elements/bonus';

export default class CollisionLogic {
    protected OFFSET_TANK_POSSIBLE_COLLISION: number = 15;
    protected OFFSET_BULLET_POSSIBLE_COLLISION: number = 10;
    public currentBonusOnMap: Bonus;
    protected itemsCollision: Array<TypeItemsCollision> = [];
    protected bullets: Array<Bullet> = [];

    public addBoard(board: Board) {
        this.itemsCollision.push(board);
    }

    public addTank(tank: Tank | TankEnemy) {
        this.itemsCollision.push(tank);
    }

    public addEnemyTank(tank: Tank | TankEnemy) {
        this.itemsCollision.push(tank);
    }

    public addBonus(bonus: Bonus) {
        this.currentBonusOnMap = bonus;
        this.itemsCollision.push(bonus);
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
        app.mapView.removeChild(bullet.bulletSprite);
        _.forEach(this.bullets, (item: Bullet) => item?.updatePossibleCollision());
    }

    public removeItem(collisionItem: TypeItemsCollision) {
        if (collisionItem.type === ElementTypeNames.WALL) {
            return;
        }
        app.mapView.removeChild(collisionItem);
        _.remove(this.itemsCollision, (item: TypeItemsCollision) => item?.id === collisionItem?.id);

    }

    public findBulletPossibleCollision(bullet: Bullet) {
        const collision: any = this.itemsCollision.filter((item: TypeItemsCollision, index: number) => {
            if (index < 1) {
                return false;
            }
            let x = item.x;
            let y = item.y;
            if (item.type === ElementTypeNames.TANK
                || item.type === ElementTypeNames.TANK_ENEMY_RED
                || item.type === ElementTypeNames.TANK_ENEMY_BLUE
                || item.type === ElementTypeNames.TANK_ENEMY_WHITE
            ) {
                x = (item as Tank).tankSprite.x;
                y = (item as Tank).tankSprite.y;
            }
            switch (bullet.currentDirection) {
                case DIRECTION_NAMES.UP : {
                    return y < bullet.bulletSprite.y
                        && x + item.width + this.OFFSET_BULLET_POSSIBLE_COLLISION > bullet.bulletSprite.x
                        && x < bullet.bulletSprite.x + bullet.bulletSprite.width + this.OFFSET_BULLET_POSSIBLE_COLLISION
                        && item.type !== ElementTypeNames.LEAVES
                        && item.type !== ElementTypeNames.WATER
                        && item.type !== ElementTypeNames.BONUS_SPEED
                        && item.type !== ElementTypeNames.BONUS_IMMORTAL
                        && item.type !== ElementTypeNames.BONUS_LIVE
                        && item.type !== ElementTypeNames.BONUS_SLOW;
                }
                case DIRECTION_NAMES.LEFT : {
                    return x < bullet.bulletSprite.x
                        && y + item.height + this.OFFSET_BULLET_POSSIBLE_COLLISION > bullet.bulletSprite.y
                        && y < bullet.bulletSprite.y + bullet.bulletSprite.height + this.OFFSET_BULLET_POSSIBLE_COLLISION
                        && item.type !== ElementTypeNames.LEAVES
                        && item.type !== ElementTypeNames.WATER
                        && item.type !== ElementTypeNames.BONUS_SPEED
                        && item.type !== ElementTypeNames.BONUS_IMMORTAL
                        && item.type !== ElementTypeNames.BONUS_LIVE
                        && item.type !== ElementTypeNames.BONUS_SLOW;
                }
                case DIRECTION_NAMES.DOWN : {
                    return y > bullet.bulletSprite.y
                        && x + item.width + this.OFFSET_BULLET_POSSIBLE_COLLISION > bullet.bulletSprite.x
                        && x < bullet.bulletSprite.x + bullet.bulletSprite.width + this.OFFSET_BULLET_POSSIBLE_COLLISION
                        && item.type !== ElementTypeNames.LEAVES
                        && item.type !== ElementTypeNames.WATER
                        && item.type !== ElementTypeNames.BONUS_SPEED
                        && item.type !== ElementTypeNames.BONUS_IMMORTAL
                        && item.type !== ElementTypeNames.BONUS_LIVE
                        && item.type !== ElementTypeNames.BONUS_SLOW;
                }
                case DIRECTION_NAMES.RIGHT : {
                    return x > bullet.bulletSprite.x
                        && y + item.height + this.OFFSET_BULLET_POSSIBLE_COLLISION > bullet.bulletSprite.y
                        && y < bullet.bulletSprite.y + bullet.bulletSprite.height + this.OFFSET_BULLET_POSSIBLE_COLLISION
                        && item.type !== ElementTypeNames.LEAVES
                        && item.type !== ElementTypeNames.WATER
                        && item.type !== ElementTypeNames.BONUS_SPEED
                        && item.type !== ElementTypeNames.BONUS_IMMORTAL
                        && item.type !== ElementTypeNames.BONUS_LIVE
                        && item.type !== ElementTypeNames.BONUS_SLOW;
                }
            }
        });
        return collision;
    }

    public findTankPossibleCollision(tank: Tank | TankEnemy) {
        const collision: any = this.itemsCollision.filter((item) => {
            switch (tank.currentDirection) {
                case DIRECTION_NAMES.UP : {
                    return item.y < tank.tankSprite.y - tank.tankSprite.height
                        && item.x + item.width + this.OFFSET_TANK_POSSIBLE_COLLISION > tank.tankSprite.x
                        && item.x < tank.tankSprite.x + tank.tankSprite.width + this.OFFSET_TANK_POSSIBLE_COLLISION
                        && item.type !== ElementTypeNames.LEAVES;
                }
                case DIRECTION_NAMES.LEFT : {
                    return item.x < tank.tankSprite.x - tank.tankSprite.width
                        && item.y + item.height + this.OFFSET_TANK_POSSIBLE_COLLISION > tank.tankSprite.y
                        && item.y < tank.tankSprite.y + tank.tankSprite.width + this.OFFSET_TANK_POSSIBLE_COLLISION
                        && item.type !== ElementTypeNames.LEAVES;
                }
                case DIRECTION_NAMES.DOWN : {
                    return item.y > tank.tankSprite.y - tank.tankSprite.height
                        && item.x + item.width + this.OFFSET_TANK_POSSIBLE_COLLISION > tank.tankSprite.x
                        && item.x < tank.tankSprite.x + tank.tankSprite.width
                        && item.type !== ElementTypeNames.LEAVES;
                }
                case DIRECTION_NAMES.RIGHT : {
                    return item.x > tank.tankSprite.x - tank.tankSprite.width
                        && item.y + item.height + this.OFFSET_TANK_POSSIBLE_COLLISION > tank.tankSprite.y
                        && item.y < tank.tankSprite.y + tank.tankSprite.width + this.OFFSET_TANK_POSSIBLE_COLLISION
                        && item.type !== ElementTypeNames.LEAVES;
                }
            }
        });
        return collision;
    }
}
