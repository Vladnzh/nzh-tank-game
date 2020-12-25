import { Container, Sprite } from 'pixi.js';
import { app } from '../../index';
import { ElementTypeNames, EVENT_NAMES } from '../constants';
import { StateNames } from '../../state-machine/state-machine-constants';

export default class MainGameView extends Container {
    public pauseButton: Sprite;

    constructor() {
        super();
        app.stage.addChild(this);
    }

    public createPauseButton(): void {
        let texture = app.loader.getTextureByTypeName(ElementTypeNames.PAUSE_BUTTON);
        this.pauseButton = new Sprite(texture);
        this.pauseButton.x = app.view.width / 2 - 36;
        this.pauseButton.width = 36;
        this.pauseButton.height = 36;
        this.pauseButton.alpha = 0.8;
        this.pauseButton.buttonMode = true;
        this.pauseButton.interactive = true;
        this.pauseButton.on(EVENT_NAMES.MOUSEDOWN, () => {
            app.stateMachine.changeState(StateNames.PAUSE_STATE);
        });
        this.addChild(this.pauseButton);
    }

}
