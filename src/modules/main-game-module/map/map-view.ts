import * as PIXI from 'pixi.js';
import { Application, app } from '../../../index';


export default class MapView extends PIXI.Container {
    public app: Application;

    constructor() {
        super();
        this.app = app;
        this.app.stage.addChild(this);
    }

}
