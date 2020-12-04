import * as PIXI from 'pixi.js';
import { app, Application } from '../../index';
import { IResourceDictionary } from 'pixi.js';
import { LoaderResourceNames } from '../../loader-module/constants/loader-constants';

export default class StartGameView extends PIXI.Container {
    public app: Application;
    public background: PIXI.Graphics;
    public startButton: PIXI.Sprite;

    constructor() {
        super();
        this.app = app;
        this.app.stage.addChild(this);
    }

    public drawView(resources?: IResourceDictionary): void {
        this.visible = false;
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x0a332e);
        this.background.drawRect(0, 0, app.view.width, app.view.height);
        this.background.endFill();
        this.startButton = new PIXI.Sprite(resources[LoaderResourceNames.START_BUTTON].texture);
        this.startButton.x = (this.app.view.width - this.startButton.width) / 2;
        this.startButton.y = (this.app.view.height - this.startButton.height) / 2;
        this.addChild(this.background);
        this.addChild(this.startButton);
    }

}
