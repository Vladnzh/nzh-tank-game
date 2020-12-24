import { app } from '../../index';
import { centeringItem } from '../../utils';
import { END_GAME_NAMES, SoundNames } from '../constants';
import StartGameView from '../start-game-module/start-game-view';

export default class EndGameView extends StartGameView {
    constructor() {
        super();
        app.stage.addChild(this);
    }

    public drawView(): void {
        super.drawView();
        const isWin = !!app.mainGameModule.amountEnemyTanks;
        app.loader.playSoundByName(isWin ? SoundNames.WIN : SoundNames.LOSE);
        this.titleText.text = isWin ? END_GAME_NAMES.YOU_DIED : END_GAME_NAMES.YOU_WON;
        this.titleText.position = centeringItem(app.view, this.titleText);
        this.titleText.y -= this.startButton.height;
    }

}
