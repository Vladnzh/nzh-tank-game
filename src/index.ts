import './styles.css';
import * as PIXI from 'pixi.js';
import Loader from './modules/loader-module/loader-controller';
import _ from 'lodash';
import { StateMachine } from './state-machine/state-machine';
import StartGame from './modules/start-game-module/start-game-controller';
import EndGame from './modules/end-game-module/end-game-controller';
import MainGame from './modules/main-game-module/main-game-controller';
import MapView from './modules/main-game-module/map/map-view';
import CollisionLogic from './modules/main-game-module/collision-logic';

export class Application extends PIXI.Application {
    protected size: Array<number> = [1024, 768];
    public loader: Loader;
    public stateMachine: StateMachine;
    public startGameModule: StartGame;
    public mainGameModule: MainGame;
    public endGameModule: EndGame;
    public collisionLogic: CollisionLogic;

    constructor() {
        super();
        this.renderer = new PIXI.Renderer({
            width: this.size[0],
            height: this.size[1],
            backgroundColor: 0x05121E,
            resolution: 1,
        });
        document.getElementById('root').appendChild(this.view);
        this.onResize();
        window.addEventListener('resize', _.debounce(() => app.onResize(), 300));
    }

    get mapView(): MapView {
        return this.mainGameModule.map.view;
    }

    public init() {
        this.stateMachine = new StateMachine();
        this.loader = new Loader();
        this.collisionLogic = new CollisionLogic();
        this.startGameModule = new StartGame();
        this.mainGameModule = new MainGame();
        this.endGameModule = new EndGame();
    }

    protected onResize() {
        let ratio = this.size[0] / this.size[1];
        let w;
        let h;
        if (window.innerWidth / window.innerHeight >= ratio) {
            w = window.innerHeight * ratio;
            h = window.innerHeight;
        } else {
            w = window.innerWidth;
            h = window.innerWidth / ratio;
        }
        this.renderer.view.style.width = w + 'px';
        this.renderer.view.style.height = h - 5 + 'px';
        this.renderer.view.style.marginLeft = (window.innerWidth - w) / 2 + 'px';
        this.renderer.view.style.marginTop = (window.innerHeight - h) / 2 + 'px';

    }
}

export let app: Application;

const start = () => {
    app = new Application();
    app.init();
};

window.onload = start;

