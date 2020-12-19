import Board from './map/elements/board';
import Tank from './map/elements/tank';
import Bullet from './map/elements/bullet';
import _ from 'lodash';
import { app } from '../../index';
import { DIRECTION_NAMES, ElementTypeNames } from '../constants';
import TankEnemy from './map/elements/tank-enemy';
import { TypeItemsCollision } from '../../interfaces';
import { itemsIntersect } from '../../utils';

export default class CollisionLogic {
    protected ignoreCollisionForBullet: Array<string> = [ElementTypeNames.LEAVES, ElementTypeNames.WATER];
    protected boards: Array<Board> = [];
    protected itemsCollision: Array<TypeItemsCollision> = [];
    protected tanks: Array<Tank | TankEnemy> = [];
    protected bullets: Array<Bullet> = [];

    constructor() {
    }

    public addBoard(board: Board) {
        // this.boards.push(board);
        this.itemsCollision.push(board);
    }

    public addTank(tank: Tank | TankEnemy) {
        // this.tanks.push(tank);
    }

    public addEnemyTank(tank: Tank | TankEnemy) {
        // this.tanks.push(tank);
        // this.itemsCollision.push(tank);
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
        _.remove(this.itemsCollision, (item: TypeItemsCollision) => item?.id === collisionItem?.id);
        app.mapView.removeChild(collisionItem);

    }

    public findBulletPossibleCollision(bullet: Bullet) {
        const collision: any = this.itemsCollision.filter((item, index: number) => {
            if(index < 1){
                return   false
            }
            switch (bullet.currentDirection) {
                case DIRECTION_NAMES.UP : {
                    return item.y < bullet.bulletSprite.y
                        && item.x + item.width + 10 > bullet.bulletSprite.x
                        && item.x < bullet.bulletSprite.x + bullet.bulletSprite.width + 10
                        && item.type !== ElementTypeNames.LEAVES
                        && item.type !== ElementTypeNames.WATER
                }
                case DIRECTION_NAMES.LEFT : {
                    return item.x < bullet.bulletSprite.x
                        && item.y + item.height + 10 > bullet.bulletSprite.y
                        && item.y < bullet.bulletSprite.y + bullet.bulletSprite.height + 10
                        && item.type !== ElementTypeNames.LEAVES
                        && item.type !== ElementTypeNames.WATER
                }
                case DIRECTION_NAMES.DOWN : {
                    return item.y > bullet.bulletSprite.y
                        && item.x + item.width + 10 > bullet.bulletSprite.x
                        && item.x < bullet.bulletSprite.x + bullet.bulletSprite.width + 10
                        && item.type !== ElementTypeNames.LEAVES
                        && item.type !== ElementTypeNames.WATER
                }
                case DIRECTION_NAMES.RIGHT : {
                    return item.x > bullet.bulletSprite.x
                        && item.y + item.height + 10 > bullet.bulletSprite.y
                        && item.y < bullet.bulletSprite.y + bullet.bulletSprite.height + 10
                        && item.type !== ElementTypeNames.LEAVES
                        && item.type !== ElementTypeNames.WATER
                }
            }
        });
        // collision.map((item: any) => app.mapView.removeChild(item));
        return collision;
    }
    // collision.map((item: any) => app.mapView.removeChild(item));

    public findTankPossibleCollision(tank: Tank | TankEnemy) {
        const collision: any = this.itemsCollision.filter((item) => {
            switch (tank.currentDirection) {
                case DIRECTION_NAMES.UP : {
                    return item.y < tank.tankSprite.y - tank.tankSprite.height
                        && item.x + item.width > tank.tankSprite.x
                        && item.x < tank.tankSprite.x + tank.tankSprite.width;
                }
                case DIRECTION_NAMES.LEFT : {
                    return item.x < tank.tankSprite.x - tank.tankSprite.width
                        && item.y + item.height > tank.tankSprite.y
                        && item.y < tank.tankSprite.y + tank.tankSprite.width;
                }
                case DIRECTION_NAMES.DOWN : {
                    return item.y > tank.tankSprite.y - tank.tankSprite.height
                        && item.x + item.width > tank.tankSprite.x
                        && item.x < tank.tankSprite.x + tank.tankSprite.width;
                }
                case DIRECTION_NAMES.RIGHT : {
                    return item.x > tank.tankSprite.x - tank.tankSprite.width
                        && item.y + item.height > tank.tankSprite.y
                        && item.y < tank.tankSprite.y + tank.tankSprite.width;
                }
            }
        });
        return collision;

    }

}
