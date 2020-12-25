import EndGameView from './end-game-view';
import StartGameController from '../start-game-module/start-game-controller';

export default class EndGameController extends StartGameController {
    protected view: EndGameView;

    constructor() {
        super();
        this.view = new EndGameView();
    }
}
