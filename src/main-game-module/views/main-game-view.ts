import * as PIXI from 'pixi.js';
import { app, Application } from '../../index';
import { IResourceDictionary } from 'pixi.js';
import { LoaderResourceNames } from '../../loader-module/constants/loader-constants';
import { EVENT_NAMES, StartGameNames } from '../constants/main-game-constants';
import { centeringItem } from '../../utils';
import { StateNames } from '../../state-machine/constants/state-machine-constants';

export default class MainGameView extends PIXI.Container {
    public app: Application;
    // public mapModule: Application;

    constructor() {
        super();
        this.app = app;
        this.app.stage.addChild(this);
    }

    public drawView(resources?: IResourceDictionary): void {
        this.visible = false;

        // this.addChild(this.mapModule);
        // this.addInteractive();
    }

    // protected addInteractive(): void {
    //     this.startButton.interactive = true;
    //     this.startButton.buttonMode = true;
    //
    //     this.startButton.on(EVENT_NAMES.MOUSEDOWN, () => {
    //         this.startButton.scale.set(0.95, 0.95);
    //         this.startButton.position = centeringItem(this.app.view, this.startButton);
    //     });
    //     this.startButton.on(EVENT_NAMES.MOUSEUP, () => {
    //         this.startButton.scale.set(1, 1);
    //         this.startButton.position = centeringItem(this.app.view, this.startButton);
    //         app.stateMachine.changeState(StateNames.GAME_STATE);
    //     });
    // }

}
