import StartGameModel from '../models/start-game-model';
import StartGameView from '../views/start-game-view';
import { IResourceDictionary } from "pixi.js";
import { app } from '../../index';

export default class StartGameController {
    protected model: StartGameModel;
    protected view: StartGameView;

    constructor() {
        this.init();
    }

    public init(): void {
        this.view = new StartGameView();
    }

    public drawView(): void {
        const resources: IResourceDictionary = app.loader.resources;
        this.view.drawView(resources);
    }

    public showView(): void {
        this.drawView()
        this.view.visible = true;
    }


}
