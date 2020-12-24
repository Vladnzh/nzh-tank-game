import * as PIXI from 'pixi.js';
import { app } from '../../index';
import { centeringItem, titleStyle } from '../../utils';
import { StateNames } from '../../state-machine/state-machine-constants';
import { ElementTypeNames, EVENT_NAMES, StartGameNames } from '../constants';

export default class StartGameView extends PIXI.Container {
    public background: PIXI.Graphics;
    public startButton: PIXI.Sprite;
    public titleText: PIXI.Text;
    public isDrawn: boolean = false;

    constructor() {
        super();
        app.stage.addChild(this);
        this.visible = false;
    }

    public drawView(): void {
        if (this.isDrawn) {
            return;
        }
        this.background = new PIXI.Graphics();
        this.titleText = new PIXI.Text(StartGameNames.TITLE, titleStyle);
        this.background.beginFill(0x0a332e);
        this.background.drawRect(0, 0, app.view.width, app.view.height);
        this.background.endFill();
        const texture = app.loader.getTextureByTypeName(ElementTypeNames.START_BUTTON);
        this.startButton = new PIXI.Sprite(texture);
        this.startButton.position = centeringItem(app.view, this.startButton);
        this.titleText.position = centeringItem(app.view, this.titleText);
        this.titleText.y -= this.startButton.height;
        this.addChild(this.background);
        this.addChild(this.startButton);
        this.addChild(this.titleText);
        this.addInteractive();
        this.isDrawn = true;
    }

    protected addInteractive(): void {
        this.startButton.buttonMode = true;
        this.startButton.on(EVENT_NAMES.MOUSEDOWN, () => {
            this.startButton.scale.set(0.95, 0.95);
            this.startButton.position = centeringItem(app.view, this.startButton);
        });
        this.startButton.on(EVENT_NAMES.MOUSEUP, () => {
            this.startButton.scale.set(1, 1);
            this.startButton.position = centeringItem(app.view, this.startButton);
            app.stateMachine.changeState(StateNames.MAIN_GAME_STATE);
        });
    }

    public interactiveButton(isInteractive: boolean): void {
        this.startButton.interactive = isInteractive;
    }
}
