import EndGameView from './end-game-view';
import { app } from '../../index';
import { TimelineLite, TweenMax } from 'gsap';

export default class EndGameController {
    protected view: EndGameView;

    constructor() {
        this.view = new EndGameView();
    }

    public drawView(): void {
        this.view.drawView();
    }

    public showView(): void {
        this.drawView();
        this.view.alpha = 0;
        this.view.visible = true;
        const tl = new TimelineLite;
        tl.to(this.view, 1, {
            alpha: 1,
        })
            .add(() => {
                this.view.interactiveButton(true);
            });
    }

    public hideView(): void {
        this.view.interactiveButton(false);
        TweenMax.to(this.view, 1, {
            alpha: 0,
            onComplete: () => {
                this.view.visible = false;
            },
        });
    }

}
