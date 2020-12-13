import * as PIXI from 'pixi.js';
import { app, Application } from '../../index';
import { IResourceDictionary } from 'pixi.js';
import { centeringItem } from '../../utils';
import { ElementTypeNames, LoaderNames } from '../constants';

export default class LoaderView extends PIXI.Container {
    public app: Application;
    public background: PIXI.Graphics;
    private loaderBg: PIXI.Sprite;
    private loaderBar: PIXI.Sprite;
    private titleText: PIXI.Text;
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
        this.loaderBg = new PIXI.Sprite(resources[ElementTypeNames.LOADER_BG].texture);
        this.loaderBar = new PIXI.Sprite(resources[ElementTypeNames.LOADER_BAR].texture);

        this.loaderBg.position = centeringItem(this.app.view, this.loaderBg);
        this.loaderBar.position = centeringItem(this.app.view, this.loaderBar);
        this.loaderBarOriginalWidth = this.loaderBar.width;
        this.loaderBar.width = 0;

        this.titleText = new PIXI.Text(LoaderNames.TITLE, {
            fill: '#acacac',
            fontFamily: 'Verdana',
            fontSize: 25,
            miterLimit: 15,
            strokeThickness: 6,
            stroke: '#2d2d2d'
        });
        this.titleText.position = centeringItem(this.app.view, this.titleText);
        this.titleText.y -= this.loaderBar.height + 15;

        this.addChild(this.background);
        this.addChild(this.loaderBg);
        this.addChild(this.loaderBar);
        this.addChild(this.titleText);

    }


    public updateProgressBar(progress: number): void {
        if (this.loaderBar) {
            this.loaderBar.width = this.loaderBarOriginalWidth / 100 * progress;
        }
    }


}
