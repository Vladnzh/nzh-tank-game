import * as PIXI from 'pixi.js';
import { IResourceDictionary } from 'pixi.js';
import { Application, app } from '../../index';
import { LoaderResourceNames } from '../../loader-module/constants/loader-constants';

const mapAtlas = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
export default class MapView extends PIXI.Container {
    public app: Application;
    public wall: PIXI.Sprite;
    public wallHeight: number = 36;
    public wallWidth: number = 36;
    public resources: IResourceDictionary;

    constructor() {
        super();
        this.app = app;
        this.app.stage.addChild(this);
    }

    public drawView(resources?: IResourceDictionary): void {
        this.wall = new PIXI.Sprite(resources[LoaderResourceNames.SMALL_WALL_1].texture);
        this.wallHeight = this.wall.height;
        this.wallWidth = this.wall.width;
        this.resources = resources;
        this.createMap();
    }

    protected createMap(): void {
        for (let i = 0; i < mapAtlas.length; i++) {
            for (let j = 0; j < mapAtlas[i].length; j++) {
                if (mapAtlas[i][j]) {
                    let index = mapAtlas[i][j];
                    if (index === 2) {
                        this.addBoardFromSmallBoard(i, j);
                    } else {
                        this.addBoardByIndex(index, i, j);
                    }
                }
            }
        }
    };

    protected addBoardByIndex(index: number, i: number, j: number) {
        let sprite: PIXI.Sprite;

        switch (index) {
            case 1: {
                sprite = new PIXI.Sprite(this.resources[LoaderResourceNames.WALL].texture);
                break;
            }
            case 2: {
                sprite = new PIXI.Sprite(this.resources[LoaderResourceNames.SMALL_WALL_1].texture);
                break;
            }
            case 3: {
                sprite = new PIXI.Sprite(this.resources[LoaderResourceNames.LEAVES].texture);
                break;
            }
            case 4: {
                sprite = new PIXI.Sprite(this.resources[LoaderResourceNames.WATER].texture);
                break;
            }
            case 5: {
                sprite = new PIXI.Sprite(this.resources[LoaderResourceNames.TANK].texture);
                break;
            }
            case 6: {
                sprite = new PIXI.Sprite(this.resources[LoaderResourceNames.TANK_ENEMY_RED].texture);
                break;
            }
        }
        sprite.x = this.wallWidth * 2 * j;
        sprite.y = this.wallHeight * 2 * i;
        this.addChild(sprite);
    };

    protected addBoardFromSmallBoard(i: number, j: number) {
        let smallWall: PIXI.Sprite;
        for (let k = 0; k <= 3; k++) {
            smallWall = new PIXI.Sprite(this.resources[LoaderResourceNames.SMALL_WALL_1].texture);
            switch (k) {
                case 0: {
                    smallWall.x = this.wallWidth * 2 * j;
                    smallWall.y = this.wallHeight * 2 * i;
                    break;
                }
                case 1: {
                    smallWall.x = this.wallWidth * 2 * j + this.wallWidth;
                    smallWall.y = this.wallHeight * 2 * i;
                    break;
                }
                case 2: {
                    smallWall.x = this.wallWidth * 2 * j;
                    smallWall.y = this.wallHeight * 2 * i + this.wallHeight;
                    break;
                }
                case 3: {
                    smallWall.x = this.wallWidth * 2 * j + this.wallWidth;
                    smallWall.y = this.wallHeight * 2 * i + this.wallHeight;
                    break;
                }
            }
            this.addChild(smallWall);
        }
    };

}
