import * as PIXI from 'pixi.js';

export default class BoardModel extends PIXI.Sprite {
    protected type: string;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super(texture);
        this.x = this.width * j;
        this.y = this.height * i;
        this.type = type;
    }


}
