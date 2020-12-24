import { StateNames } from './state-machine-constants';
import { app } from '../index';
import MainGameController from '../modules/main-game-module/main-game-controller';
import { Ticker } from 'pixi.js';

export class StateMachine {
    private prevState: string;
    private currentState: string;

    public changeState(newStateName: string): void {
        this.prevState = this.currentState;
        this.currentState = newStateName;
        this.stateChanged();
    }

    public stateChanged(): void {
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
                if (this.prevState === StateNames.END_GAME_STATE) {
                    app.endGameModule.hideView();
                } else {
                    app.startGameModule.hideView();
                }
                app.mainGameModule.showView();
                break;
            }
            case StateNames.END_GAME_STATE : {
                // app.ticker.stop()
                // app.ticker = new Ticker()
                app.mainGameModule.collisionLogic.reset();
                app.mainGameModule.hideView();
                app.mainGameModule = new MainGameController()
                app.endGameModule.showView();
                break;
            }
        }
    }

    private log(): void {
        console.log(`%cCURRENT STATE: ${this.currentState}`, 'color: Orange');
    }

}
