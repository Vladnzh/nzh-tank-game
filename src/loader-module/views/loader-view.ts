import * as PIXI from 'pixi.js';
import { app, Application } from '../../index';
import { IResourceDictionary, Loader } from 'pixi.js';
import { LoaderResourceNames } from '../constants/loader-constants';

export default class LoaderView extends PIXI.Container {
    public app: Application;
    public background: PIXI.Graphics;
    private loaderBg: PIXI.Sprite;
    private loaderBar: PIXI.Sprite;
    private loaderBarOriginalWidth: number;

    constructor() {
        super();
        this.app = app;
        this.app.stage.addChild(this);
    }

    public drawBackground(resources: IResourceDictionary): void {
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x0b2335);
        this.background.drawRect(0, 0, app.view.width, app.view.height);
        this.background.endFill();
        this.loaderBg = new PIXI.Sprite(resources[LoaderResourceNames.LOADER_BG].texture);
        this.loaderBar = new PIXI.Sprite(resources[LoaderResourceNames.LOADER_BAR].texture);

        this.loaderBg.x = (this.app.view.width - this.loaderBg.width) / 2;
        this.loaderBg.y = (this.app.view.height - this.loaderBg.height) / 2;
        this.loaderBar.x = (this.app.view.width - this.loaderBar.width) / 2;
        this.loaderBar.y = (this.app.view.height - this.loaderBar.height) / 2;
        this.loaderBarOriginalWidth = this.loaderBar.width;
        this.loaderBar.width = 0

        this.addChild(this.background);
        this.addChild(this.loaderBg);
        this.addChild(this.loaderBar);

    }


    public updateProgressBar(progress: number): void {
        if(this.loaderBar) {
            this.loaderBar.width = this.loaderBarOriginalWidth / 100 * progress
        }
    }


}
