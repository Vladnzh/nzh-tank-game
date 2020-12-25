import * as PIXI from 'pixi.js';
import Sound from 'pixi-sound';
import LoaderView from './loader-view';
import { AnimatedSprite, IResourceDictionary, Loader } from 'pixi.js';
import _ from 'lodash';
import { app } from '../../index';
import { StateNames } from '../../state-machine/state-machine-constants';
import { TweenMax } from 'gsap';
import { AnimationsNames, ElementTypeNames, SoundNames } from '../constants';

export default class LoaderController extends PIXI.Loader {
    protected view: LoaderView;
    protected progressBarLoader: PIXI.Loader;

    constructor() {
        super();
        this.init();
    }

    protected init(): void {
        this.loadResources();
        this.view = new LoaderView();
    }

    protected loadResources(): void {
        app.stateMachine.changeState(StateNames.LOADER_STATE);
        this.baseUrl = '../../../assets';
        this.progressBarLoader = new PIXI.Loader(this.baseUrl);
        this.progressBarLoader.add(ElementTypeNames.LOADER_BAR, 'loader-bar/loader-bar.png')
            .add(ElementTypeNames.LOADER_BG, 'loader-bar/loader-bg.png')
            .load();

        this.add(ElementTypeNames.EAGLE, 'board/eagle.png')
            .add(ElementTypeNames.LEAVES, 'board/leaves.png')
            .add(ElementTypeNames.SMALL_WALL, 'board/small_wall_1.png')
            .add(ElementTypeNames.WALL, 'board/wall.png')
            .add(ElementTypeNames.WATER, 'board/water.png')
            .add(ElementTypeNames.BONUS_IMMORTAL, 'bonus/bonus_immortal.png')
            .add(ElementTypeNames.BONUS_LIVE, 'bonus/bonus_live.png')
            .add(ElementTypeNames.BONUS_SLOW, 'bonus/bonus_slow.png')
            .add(ElementTypeNames.BONUS_SPEED, 'bonus/bonus_speed.png')
            .add(ElementTypeNames.TANK, 'tanks/tank.png')
            .add(ElementTypeNames.TANK_ENEMY_BLUE, 'tanks/enemy_blue.png')
            .add(ElementTypeNames.TANK_ENEMY_RED, 'tanks/enemy_red.png')
            .add(ElementTypeNames.TANK_ENEMY_WHITE, 'tanks/enemy_white.png')
            .add(ElementTypeNames.START_BUTTON, 'button.png')
            .add(ElementTypeNames.BULLET, 'bullet.png')
            .add(ElementTypeNames.BULLET_ENEMY, 'enemy_bullet.png')
            .add(ElementTypeNames.HEART, 'heart.png')
            .add(ElementTypeNames.PAUSE_BUTTON, 'pause.png')
            .add(ElementTypeNames.PLAY_BUTTON, 'play.png')
            .add(AnimationsNames.ANIMATIONS, 'animations.json')
            .add(SoundNames.BONUS, 'sounds/bonus.wav')
            .add(SoundNames.EXPLODE, 'sounds/explode.wav')
            .add(SoundNames.HIT, 'sounds/hit.wav')
            .add(SoundNames.LOSE, 'sounds/lose.wav')
            .add(SoundNames.SHOT, 'sounds/shot.wav')
            .add(SoundNames.WIN, 'sounds/win.wav')
            .load();
        this.onProgress.add(this.onProgressCallBack.bind(this));
        this.onComplete.add(this.onCompleteCallBack.bind(this));
        this.progressBarLoader.onComplete.add(this.progressBarLoaderOnCompleteCallBack.bind(this));

    }

    public getTextureByTypeName(typeName: string): PIXI.Texture {
        return this.resources[typeName].texture;
    }

    public getAnimationByName(name: string): AnimatedSprite {
        return new PIXI.AnimatedSprite(this.resources[AnimationsNames.ANIMATIONS].spritesheet.animations[name]);
    }

    public playSoundByName(name: string) {
        Sound.play(name);
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
        app.stateMachine.changeState(StateNames.START_GAME_STATE);
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
