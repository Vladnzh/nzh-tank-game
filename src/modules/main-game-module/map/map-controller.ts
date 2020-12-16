import MapView from './map-view';
import { TweenMax } from 'gsap';
import { app } from '../../../index';
import PIXI from 'pixi.js';
import { mapMatrix } from '../../../utils';
import Board from './elements/board';
import Tank from './elements/tank';
import { ElementTypeNames } from '../../constants';
import TankEnemy from './elements/tank-enemy';
import Bonus from './elements/bonus';

export default class MapController {
    public view: MapView;

    constructor() {
        this.init();
    }

    public getView(): MapView {
        return this.view;
    }

    public init(): void {
        this.view = new MapView();
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
        this.view.sortChildren()
    };

    protected addBoardByIndex(index: number, i: number, j: number) {
        let sprite: PIXI.Container;
        let texture: PIXI.Texture;

        switch (index) {
            case 1: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.WALL);
                sprite = new Board(texture, ElementTypeNames.WALL, i, j);
                break;
            }
            case 3: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.LEAVES);
                sprite = new Board(texture, ElementTypeNames.LEAVES, i, j);
                sprite.zIndex = 1
                break;
            }
            case 4: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.WATER);
                sprite = new Board(texture, ElementTypeNames.WATER, i, j);
                break;
            }
            case 5: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.TANK);
                const tank = new Tank(texture, ElementTypeNames.TANK, i, j);
                sprite = tank;
                break;
            }
            case 6: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.TANK_ENEMY_RED);
                sprite = new TankEnemy(texture, ElementTypeNames.TANK_ENEMY_RED, i, j);
                break;
            }
            case 7: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.EAGLE);
                sprite = new Board(texture, ElementTypeNames.EAGLE, i, j);
                break;
            }
            case 8: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.BONUS_SPEED);
                sprite = new Bonus(texture, ElementTypeNames.BONUS_SPEED, i, j);
                break;
            }
            case 9: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.BONUS_LIVE);
                sprite = new Bonus(texture, ElementTypeNames.BONUS_LIVE, i, j);
                break;
            }
            case 10: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.BONUS_IMMORTAL);
                sprite = new Bonus(texture, ElementTypeNames.BONUS_IMMORTAL, i, j);
                break;
            }
            case 11: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.BONUS_SLOW);
                sprite = new Bonus(texture, ElementTypeNames.BONUS_SLOW, i, j);
                break;
            }
        }
        this.view.addChild(sprite);
    };

    protected addBoardFromSmallBoard(i: number, j: number) {
        let board: Board;
        for (let k = 0; k <= 3; k++) {
            const texture = app.loader.getTextureByTypeName(ElementTypeNames.SMALL_WALL_1);
            board = new Board(texture, ElementTypeNames.SMALL_WALL_1, i, j);
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
