import * as PIXI from 'pixi.js';
import { app, Application } from '../../index';
import { IResourceDictionary } from 'pixi.js';
import { LoaderResourceNames } from '../../loader-module/constants/loader-constants';
import { EVENT_NAMES, StartGameNames } from '../constants/start-game-constants';
import { centeringItem } from '../../utils';
import { StateNames } from '../../state-machine/constants/state-machine-constants';

export default class StartGameView extends PIXI.Container {
    public app: Application;
    public background: PIXI.Graphics;
    public startButton: PIXI.Sprite;
    public titleText: PIXI.Text;

    constructor() {
        super();
        this.app = app;
        this.app.stage.addChild(this);
    }

    public drawView(resources?: IResourceDictionary): void {
        this.visible = false;
        this.background = new PIXI.Graphics();
        this.titleText = new PIXI.Text(StartGameNames.TITLE, {
            dropShadow: true,
            dropShadowAlpha: 0.2,
            dropShadowBlur: 4,
            dropShadowDistance: 8,
            fill: [
                '#3f5568',
                '#0a1f2f',
            ],
            fillGradientStops: [
                0.50,
                0.1,
            ],
            fontFamily: 'Arial Black',
            fontSize: 100,
            fontWeight: 'bold',
            miterLimit: 15,
            strokeThickness: 6,
        });
        this.background.beginFill(0x0a332e);
        this.background.drawRect(0, 0, app.view.width, app.view.height);
        this.background.endFill();
        this.startButton = new PIXI.Sprite(resources[LoaderResourceNames.START_BUTTON].texture);
        this.startButton.position = centeringItem(this.app.view, this.startButton);
        this.titleText.position = centeringItem(this.app.view, this.titleText);
        this.titleText.y -= this.startButton.height;
        this.addChild(this.background);
        this.addChild(this.startButton);
        this.addChild(this.titleText);
        this.addInteractive();
    }

    protected addInteractive(): void {
        this.startButton.interactive = true;
        this.startButton.buttonMode = true;

        this.startButton.on(EVENT_NAMES.MOUSEDOWN, () => {
            this.startButton.scale.set(0.95, 0.95);
            this.startButton.position = centeringItem(this.app.view, this.startButton);
        });
        this.startButton.on(EVENT_NAMES.MOUSEUP, () => {
            this.startButton.scale.set(1, 1);
            this.startButton.position = centeringItem(this.app.view, this.startButton);
            app.stateMachine.changeState(StateNames.GAME_STATE);
        });
    }

}
