import StartGameView from './start-game-view';
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
        this.view.drawView();
    }

    public showView(): void {
        this.drawView();
        this.view.alpha = 0
        this.view.visible = true
        TweenMax.to(this.view, 1, {
            alpha: 1,
        });    }

    public hideView(): void {
        TweenMax.to(this.view, 1, {
            alpha: 0,
            onComplete: () => {
                this.view.visible = false;
            },
        });
    }

}
