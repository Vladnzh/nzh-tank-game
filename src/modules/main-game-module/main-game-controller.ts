import MainGameView from './main-game-view';
import { IResourceDictionary } from 'pixi.js';
import { app } from '../../index';
import { TweenMax } from 'gsap';
import MapController from './map/map-controller';

export default class MainGameController {
    public view: MainGameView;
    public map: MapController;

    constructor() {
        this.init();
    }

    public init(): void {
        this.view = new MainGameView();
        this.map = new MapController();
    }

    public drawView(): void {
        this.map.drawView();
        const mapView = this.map.getView();
        this.view.addChild(mapView);
    }

    public showView(): void {
        this.drawView();
        this.view.alpha = 0;
        this.view.visible = true;
        TweenMax.to(this.view, 1, {
            alpha: 1,
        });
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