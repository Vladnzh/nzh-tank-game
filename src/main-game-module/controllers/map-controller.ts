import MapView from '../views/map-view';
import { IResourceDictionary } from 'pixi.js';
import { TweenMax } from 'gsap';
import { app } from '../../index';
import PIXI from 'pixi.js';
import { LoaderResourceNames } from '../../loader-module/constants/loader-constants';
import { mapMatrix } from '../../utils';
import BoardModel from '../models/board-model';
import TankController from './tank-controller';

export default class MapController {
    public view: MapView;
    protected resources: IResourceDictionary;

    constructor() {
        this.init();
    }

    public getView(): MapView {
        return this.view;
    }

    public init(): void {
        this.view = new MapView();
        this.resources = app.loader.resources;

    }

    public drawView(): void {
        this.createMap();
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

    protected createMap(): void {
        for (let i = 0; i < mapMatrix.length; i++) {
            for (let j = 0; j < mapMatrix[i].length; j++) {
                if (mapMatrix[i][j]) {
                    let index = mapMatrix[i][j];
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
                sprite = new BoardModel(this.resources[LoaderResourceNames.WALL].texture, LoaderResourceNames.WALL, i, j);
                break;
            }
            case 3: {
                sprite = new BoardModel(this.resources[LoaderResourceNames.LEAVES].texture, LoaderResourceNames.LEAVES, i, j);
                break;
            }
            case 4: {
                sprite = new BoardModel(this.resources[LoaderResourceNames.WATER].texture, LoaderResourceNames.WATER, i, j);
                break;
            }
            case 5: {
                const tank = new TankController(this.resources[LoaderResourceNames.TANK].texture, LoaderResourceNames.TANK, i, j);
                sprite = tank.tankSprite;
                break;
            }
            case 6: {
                sprite = new BoardModel(this.resources[LoaderResourceNames.TANK_ENEMY_RED].texture, LoaderResourceNames.TANK_ENEMY_RED, i, j);
                break;
            }
        }
        this.view.addChild(sprite);
    };

    protected addBoardFromSmallBoard(i: number, j: number) {
        let board: BoardModel;
        for (let k = 0; k <= 3; k++) {
            board = new BoardModel(this.resources[LoaderResourceNames.SMALL_WALL_1].texture, LoaderResourceNames.SMALL_WALL_1, i, j);
            switch (k) {
                case 0: {
                    board.x = board.width * 2 * j;
                    board.y = board.height * 2 * i;
                    break;
                }
                case 1: {
                    board.x = board.width * 2 * j + board.width;
                    board.y = board.height * 2 * i;
                    break;
                }
                case 2: {
                    board.x = board.width * 2 * j;
                    board.y = board.height * 2 * i + board.height;
                    break;
                }
                case 3: {
                    board.x = board.width * 2 * j + board.width;
                    board.y = board.height * 2 * i + board.height;
                    break;
                }
            }
            this.view.addChild(board);
        }
    };
}
