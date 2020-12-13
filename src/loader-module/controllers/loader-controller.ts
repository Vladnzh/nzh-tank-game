import * as PIXI from 'pixi.js';
import LoaderView from '../views/loader-view';
import { IResourceDictionary, Loader } from 'pixi.js';
import { LoaderResourceNames } from '../constants/loader-constants';
import _ from 'lodash';
import { app } from '../../index';
import { StateNames } from '../../state-machine/constants/state-machine-constants';
import { TweenMax } from "gsap";

export default class LoaderController extends PIXI.Loader {
    protected view: LoaderView;
    protected progressBarLoader: PIXI.Loader;

    constructor() {
        super();
        this.init();
    }

    public init(): void {
        this.loadResources();
        this.view = new LoaderView();
    }

    protected loadResources(): void {
        app.stateMachine.changeState(StateNames.LOADER_STATE)

        this.baseUrl = '../../../assets';
        this.progressBarLoader = new PIXI.Loader(this.baseUrl);
        this.progressBarLoader.add(LoaderResourceNames.LOADER_BAR, 'loader-bar/loader-bar.png')
            .add(LoaderResourceNames.LOADER_BG, 'loader-bar/loader-bg.png')
            .load();

        this.add(LoaderResourceNames.EAGLE, 'board/eagle.png')
            .add(LoaderResourceNames.LEAVES, 'board/leaves.png')
            .add(LoaderResourceNames.SMALL_WALL_1, 'board/small_wall_1.png')
            .add(LoaderResourceNames.SMALL_WALL_2, 'board/small_wall_2.png')
            .add(LoaderResourceNames.SMALL_WALL_3, 'board/small_wall_3.png')
            .add(LoaderResourceNames.SMALL_WALL_4, 'board/small_wall_4.png')
            .add(LoaderResourceNames.WALL, 'board/wall.png')
            .add(LoaderResourceNames.WATER, 'board/water.png')
            .add(LoaderResourceNames.BONUS_IMMORTAL, 'bonus/bonus_immortal.png')
            .add(LoaderResourceNames.BONUS_LIVE, 'bonus/bonus_live.png')
            .add(LoaderResourceNames.BONUS_SLOW, 'bonus/bonus_slow.png')
            .add(LoaderResourceNames.BONUS_SPEED, 'bonus/bonus_speed.png')
            .add(LoaderResourceNames.TANK, 'tanks/tank.png')
            .add(LoaderResourceNames.TANK_ENEMY_BLUE, 'tanks/enemy_blue.png')
            .add(LoaderResourceNames.TANK_ENEMY_RED, 'tanks/enemy_red.png')
            .add(LoaderResourceNames.TANK_ENEMY_WHITE, 'tanks/enemy_white.png')
            .add(LoaderResourceNames.START_BUTTON, 'button.png')
            .add(LoaderResourceNames.BULLET, 'bullet.png')
            .load();

        this.onProgress.add(this.onProgressCallBack.bind(this));
        this.onComplete.add(this.onCompleteCallBack.bind(this));
        this.progressBarLoader.onComplete.add(this.progressBarLoaderOnCompleteCallBack.bind(this));

    }

    protected progressBarLoaderOnCompleteCallBack(e: Loader): void {
        if (!_.isNil(this.view)) {
            const resources: IResourceDictionary = e.resources;
            this.view.drawBackground(resources);
        }
    }

    protected onProgressCallBack(e: Loader): void {
        if (!_.isNil(this.view)) {
            this.view.updateProgressBar(e.progress);
        }
    }

    protected onCompleteCallBack(e: Loader): void {
        app.stateMachine.changeState(StateNames.START_GAME_STATE)
    }

    public hideView(): void {
        TweenMax.to(this.view, 1, {
            alpha: 0,
            onComplete: () => {
                this.view.visible = false;
            },
        });
    }
}
