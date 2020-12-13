import * as PIXI from 'pixi.js';
import { app } from '../../../../index';

export default class Board extends PIXI.Sprite {
    public type: string;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super(texture);
        this.x = this.width * j;
        this.y = this.height * i;
        this.type = type;
        app.collisionLogic.addBoard(this)
    }


}
