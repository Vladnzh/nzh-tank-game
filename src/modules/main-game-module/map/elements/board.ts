import * as PIXI from 'pixi.js';
import { app } from '../../../../index';
import { DefaultTextureSize } from '../../../constants';

export default class Board extends PIXI.Sprite {
    public type: string;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super(texture);
        this.x = DefaultTextureSize.WIDTH * j;
        this.y = DefaultTextureSize.HEIGHT * i;
        this.type = type;
        app.mainGameModule.collisionLogic.addBoard(this)
    }


}
