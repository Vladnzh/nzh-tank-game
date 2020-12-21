import * as PIXI from 'pixi.js';
import { app } from '../../../../index';
import { v4 as uuidv4 } from 'uuid';

export default class Bonus extends PIXI.Sprite {
    public id: string;
    public type: string;

    constructor(texture: PIXI.Texture, type: string, x: number, y: number) {
        super(texture);
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.type = type;
        app.mainGameModule.collisionLogic.addBonus(this);
    }
    public remove(){
        app.mainGameModule.collisionLogic.removeBonus(this);
    }
}
