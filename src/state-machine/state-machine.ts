import { StateNames } from './state-machine-constants';
import { app } from '../index';

export class StateMachine {
    private prevState: string;
    private currentState: string;

    public changeState(newStateName: string): void {
        this.prevState = this.currentState;
        this.currentState = newStateName;
        this.stateChanged();
    }

    public stateChanged(): void {
        this.log()
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
                }
                app.startGameModule.hideView();
                app.mainGameModule.showView();
                break;
            }
            case StateNames.END_GAME_STATE : {
                app.mainGameModule.hideView();
                app.endGameModule.showView();
                break;
            }
        }
    }

    private log(): void {
        console.log(`%cCURRENT STATE: ${this.currentState}`, 'color: Orange');
    }

}
