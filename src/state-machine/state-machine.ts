import { StateNames } from './state-machine-constants';
import { app } from '../index';
import MainGameController from '../modules/main-game-module/main-game-controller';

export class StateMachine {
    protected prevState: string;
    protected currentState: string;

    public changeState(newStateName: string): void {
        this.prevState = this.currentState;
        this.currentState = newStateName;
        this.stateChanged();
    }

    protected stateChanged(): void {
        this.log();
        switch (this.currentState) {
            case StateNames.LOADER_STATE : {
                break;
            }
            case StateNames.START_GAME_STATE : {
                app.loader.hideView();
                app.startGameModule.showView();
                break;
            }
            case StateNames.MAIN_GAME_STATE : {
                if (this.prevState === StateNames.PAUSE_STATE) {
                    app.isPause = false;
                    app.mainGameModule.map.pauseVisibleOnMap(true);
                    app.pauseGameModule.hideView();
                    return;
                }
                if (this.prevState === StateNames.END_GAME_STATE) {
                    app.endGameModule.hideView();
                } else {
                    app.startGameModule.hideView();
                }

                app.mainGameModule.showView();
                break;
            }
            case StateNames.PAUSE_STATE : {
                if (this.prevState === StateNames.MAIN_GAME_STATE) {
                    app.isPause = true;
                    app.pauseGameModule.showView();
                    app.mainGameModule.map.pauseVisibleOnMap(false);
                }
                break;
            }
            case StateNames.END_GAME_STATE : {
                app.mainGameModule.removeChildren();
                app.mainGameModule.hideView();
                app.endGameModule.showView();
                app.mainGameModule = new MainGameController();
                break;
            }
        }
    }

    protected log(): void {
        console.log(`%cCURRENT STATE: ${this.currentState}`, 'color: Orange');
    }

}
