import { StateNames } from './constants/state-machine-constants';
import { app } from '../index';

export class StateMachine {
    private states: Array<string> = [];
    private currentState: string;

    public addState(stateName: string): void {
        this.states.push(stateName);
    }

    public changeState(newStateName: string): void {
        this.currentState = newStateName;
        console.log(`%cCURRENT STATE: ${this.currentState}`, "color: Orange");
        this.stateChanged();
    }

    public getCurrentState(): string {
        return this.currentState;
    }

    public stateChanged(): void {
        switch (this.currentState) {
            case StateNames.LOADER_STATE : {
                break;
            }
            case StateNames.START_GAME_STATE : {
                app.loader.hideView();
                app.startGameModule.showView();
                break;
            }
            case StateNames.GAME_STATE : {
                app.startGameModule.hideView();
                break;
            }
        }
    }

}
