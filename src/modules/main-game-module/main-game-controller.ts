import { TweenMax } from 'gsap';
import MapController from './map-controller';
import CollisionLogic from './collision-logic';
import { Container } from 'pixi.js';
import { app } from '../../index';

export default class MainGameController {
    public view: Container;
    public map: MapController;
    public collisionLogic: CollisionLogic;
    public isDrawn: boolean = false;

    constructor() {
        this.collisionLogic = new CollisionLogic();
        this.view = new Container();
        this.view.name = 'mainGame'
        this.map = new MapController(this.view);
        this.isDrawn = true;
        app.stage.addChild(this.view);
    }

    public drawView(): void {
        this.map.createMap();
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
                app.stage.removeChild(this.view);
            },
        });
    }

}
