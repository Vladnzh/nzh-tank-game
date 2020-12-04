import StartGameView from '../views/start-game-view';
import { IResourceDictionary } from 'pixi.js';
import { app } from '../../index';
import { TweenMax } from 'gsap';

export default class StartGameController {
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
        this.drawView();
        this.view.visible = true;
    }

    public hideView(): void {
        TweenMax.to(this.view, 1, {
            alpha: 0,
            onComplete: () => {
                this.view.visible = false;
            },
        });
    }

}
