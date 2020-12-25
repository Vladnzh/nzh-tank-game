import { app } from '../../index';
import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';
import { ElementTypeNames, EVENT_NAMES } from '../constants';
import { centeringItem } from '../../utils';
import { StateNames } from '../../state-machine/state-machine-constants';

export default class PauseGameView extends Container {
    public background: PIXI.Graphics;
    public buttonResume: PIXI.Sprite;
    public isDrawn: boolean = false;

    constructor() {
        super();
        app.stage.addChild(this);
        this.visible = false;
    }

    public drawView(): void {
        this.showView();
        if (this.isDrawn) {
            return;
        }
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x0a332e);
        this.background.drawRect(0, 0, app.view.width, app.view.height);
        this.background.endFill();
        this.background.alpha = 0.8;
        this.buttonResume = new PIXI.Sprite();
        const texture = app.loader.getTextureByTypeName(ElementTypeNames.PLAY_BUTTON);
        this.buttonResume = new PIXI.Sprite(texture);
        this.buttonResume.position = centeringItem(app.view, this.buttonResume);
        this.buttonResume.width = 100;
        this.buttonResume.height = 100;
        this.buttonResume.alpha = 0.8;
        this.buttonResume.buttonMode = true;
        this.buttonResume.interactive = true;
        this.buttonResume.on(EVENT_NAMES.MOUSEDOWN, () => {
            app.stateMachine.changeState(StateNames.MAIN_GAME_STATE);
        });
        this.addChild(this.background);
        this.addChild(this.buttonResume);
        this.isDrawn = true;
    }

    public showView(): void {
        this.visible = true;
    }

    public hideView(): void {
        this.visible = false;
    }

}
