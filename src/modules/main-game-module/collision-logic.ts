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
        this.itemsCollision.push(tank);
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
        this.addBullet(bullet);
        if (bullet.currentDirection === DIRECTION_NAMES.LEFT) {
            const collision: any = this.itemsCollision.filter((item) => {
                return item.x < bullet.bulletSprite.x
                    && item.y + item.height + 10 > bullet.bulletSprite.y
                    && item.y < bullet.bulletSprite.y + bullet.bulletSprite.height + 10
                    && item.type !== ElementTypeNames.LEAVES
                    && item.type !== ElementTypeNames.WATER;
            });
            return collision;
        }
    }

    public findTankPossibleCollision(tank: Tank) {
        this.addTank(tank);
        if (tank.currentDirection === DIRECTION_NAMES.LEFT) {
            const collision: any = this.itemsCollision.filter((item: Board) => {
                return item.x < tank.tankSprite.x - (tank.tankSprite.width)
                    && item.y + item.height > tank.tankSprite.y
                    && item.y < tank.tankSprite.y + tank.tankSprite.width
                    && item.type !== ElementTypeNames.LEAVES
                    && item.type !== ElementTypeNames.WATER;
            });
            // console.log('this.itemsCollision', this.itemsCollision);
            // collision.map((item: Board) => app.mapView.removeChild(item));
            return collision;
        }
    }

    public findTankCollision(tank: Tank | TankEnemy): TypeItemsCollision {
        return this.itemsCollision.find((item: TypeItemsCollision) =>
            itemsIntersect(tank, item));
    }


}
