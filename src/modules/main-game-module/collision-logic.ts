import Board from './map/elements/board';
import Tank from './map/elements/tank';
import Bullet from './map/elements/bullet';
import _ from 'lodash';
import { app } from '../../index';
import { ElementTypeNames } from '../constants';
import TankEnemy from './map/elements/tank-enemy';
import { TypeItemsCollision } from '../../interfaces';
import { StateNames } from '../../state-machine/state-machine-constants';

export default class CollisionLogic {
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

    public addBullet(board: Bullet) {

    }

    public findBulletCollision(bullet: Bullet) {
        _.forEach(this.itemsCollision, (item: TypeItemsCollision, index) => {
            if (this.itemsIntersect(bullet.bulletSprite, item) && item.type != ElementTypeNames.LEAVES) {
                bullet.playAnimation();
                bullet.stop();
                app.mapView.removeChild(bullet.bulletSprite);
                if (item.type === ElementTypeNames.SMALL_WALL_1) {
                    app.mapView.removeChild(item);
                    item.destroy();
                    this.itemsCollision.splice(index, 1);
                    return;
                }
                app.mapView.removeChild(bullet.bulletSprite);
                if (item.type === ElementTypeNames.TANK_ENEMY_RED) {
                    (item as TankEnemy).onExplode();
                    this.itemsCollision.splice(index, 1);
                    app.mapView.removeChild(item);
                    item.destroy();
                    return;
                }
                if (item.type === ElementTypeNames.EAGLE) {
                    this.itemsCollision.splice(index, 1);
                    app.mapView.removeChild(item);
                    app.stateMachine.changeState(StateNames.END_GAME_STATE);
                    item.destroy();
                    return;
                }
            }
        });
    }

    public findTankCollision(tank: Tank | TankEnemy): TypeItemsCollision {
        return this.itemsCollision.find((item: TypeItemsCollision) =>
            this.itemsIntersect(tank, item));
    }

    private itemsIntersect(a: any, b: any): boolean {
        if (!a || !b) {
            return false;
        }
        if (a.type === b.type) {
            return false;
        }
        const ab = a.getBounds();
        const bb = b.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

}
