import * as PIXI from 'pixi.js';
import { DefaultTextureSize } from '../../../constants';

export default class Bonus extends PIXI.Sprite {
    public type: string;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super(texture);
        this.x = DefaultTextureSize.WIDTH * j + 2;
        this.y = DefaultTextureSize.HEIGHT * i + 2;
        this.type = type;
        // app.collisionLogic.addBoard(this)
    }
}
