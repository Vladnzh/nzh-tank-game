import PauseGameView from './pause-game-view';

export default class PauseGameController {
    protected view: PauseGameView;

    constructor() {
        this.view = new PauseGameView();
    }

    public showView(): void {
        this.view.drawView();
    }
    public hideView(): void {
        this.view.hideView();
    }
}
