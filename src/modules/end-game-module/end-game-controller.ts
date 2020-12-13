import EndGameView from './end-game-view';
import { IResourceDictionary } from 'pixi.js';
import { app } from '../../index';
import { TweenMax } from 'gsap';

export default class EndGameController {
    protected view: EndGameView;

    constructor() {
        this.init();
    }

    public init(): void {
        this.view = new EndGameView();
    }

    public drawView(): void {
        const resources: IResourceDictionary = app.loader.resources;
        this.view.drawView(resources);
    }

    public showView(): void {
        this.drawView();
        this.view.alpha = 0
        this.view.visible = true
        TweenMax.to(this.view, 1, {
            alpha: 1,
        });
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
