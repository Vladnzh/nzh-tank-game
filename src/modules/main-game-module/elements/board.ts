import * as PIXI from 'pixi.js';
import { app } from '../../../index';
import { DefaultTextureSize, SoundNames } from '../../constants';
import { v4 as uuidv4 } from 'uuid';

export default class Board extends PIXI.Sprite {
    public type: string;
    public id: string;

    constructor(texture: PIXI.Texture, type: string, i: number, j: number) {
        super(texture);
        this.x = DefaultTextureSize.WIDTH * j;
        this.y = DefaultTextureSize.HEIGHT * i;
        this.type = type;
        this.id = uuidv4();
        app.mainGameModule.addBoard(this);
    }

    public remove(): void {
        app.mainGameView.removeChild(this);
        app.loader.playSoundByName(SoundNames.HIT);
    }

}
