import Board from './map/elements/board';
import Tank from './map/elements/tank';
import Bullet from './map/elements/bullet';
import _ from 'lodash';
import { app } from '../../index';
import { ElementTypeNames } from '../constants';

export default class CollisionLogic {
    protected boards: Array<Board> = [];
    protected tanks: Array<Tank> = [];
    protected bullets: Array<Bullet> = [];

    constructor() {
    }

    public addBoard(board: Board) {
        this.boards.push(board);
    }

    public addBullet(board: Bullet) {

    }

    public findBulletCollision(bullet: Bullet) {
        _.forEach(this.boards, (board: Board, index) => {
            if (this.boxesIntersect(bullet.shellSprite, board) && board.type != ElementTypeNames.LEAVES) {
                bullet.stop();
                app.mapView.removeChild(bullet.shellSprite);
                if (board.type === ElementTypeNames.SMALL_WALL_1) {
                    app.mapView.removeChild(board);
                    this.boards.splice(index, 1);
                    return;
                }
            }
        });
    }

    public checkCanMove(tank: Tank): boolean {
        return !Boolean(this.boards.find((board: Board) => {
            return this.boxesIntersect(tank.tankSprite, board);
        }));
    }

    private boxesIntersect(a: any, b: any): boolean {
        if (!a || !b) {
            return false;
        }
        const ab = a.getBounds();
        const bb = b.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;

    }
}
