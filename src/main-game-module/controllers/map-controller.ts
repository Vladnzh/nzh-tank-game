import MapView from '../views/map-view';
import { IResourceDictionary } from 'pixi.js';
import { TweenMax } from 'gsap';
import { app } from '../../index';

export default class MapController {
    protected view: MapView;

    constructor() {
        this.init();
    }

    public getView(): MapView {
       return  this.view
    }
    public init(): void {
        this.view = new MapView();
    }

    public drawView(): void {
        const resources: IResourceDictionary = app.loader.resources;
        this.view.drawView(resources);
    }

    public showView(): void {
        this.drawView();
        this.view.alpha = 0
        this.view.visible = true
        TweenMax.to(this.view, 1, {
            alpha: 1,
        });    }

    public hideView(): void {
        TweenMax.to(this.view, 1, {
            alpha: 0,
            onComplete: () => {
                this.view.visible = false;
            },
        });
    }

}
