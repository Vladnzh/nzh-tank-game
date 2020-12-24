import { TweenMax } from 'gsap';
import { app } from '../../index';
import PIXI, { Container, Point, Sprite } from 'pixi.js';
import { centeringItem, mapMatrix, textureBonusNames, textureTankNames } from '../../utils';
import Board from './elements/board';
import Tank from './elements/tank';
import { DefaultParams, DefaultTextureSize, ElementTypeNames } from '../constants';
import TankEnemy from './elements/tank-enemy';
import Bonus from './elements/bonus';
import _ from 'lodash';

export default class MapController {
    protected emptySpaces: Array<PIXI.Point> = [];
    protected textureTankNames: Array<string>;
    public lifeSprites: Array<Sprite> = [];
    public view: Container;

    constructor(view: Container) {
        this.view = view;
    }

    public createMap(): void {
        this.textureTankNames = _.cloneDeep(textureTankNames);
        for (let i = 0; i < mapMatrix.length; i++) {
            for (let j = 0; j < mapMatrix[i].length; j++) {
                if (mapMatrix[i][j]) {
                    let index = mapMatrix[i][j];
                    if (index === 2) {
                        this.createBoardFromSmallBoard(i, j);
                    } else if (index === 0) {

                    } else {
                        this.createTextureByIndex(index, i, j);
                    }
                } else {
                    const point = new Point(DefaultTextureSize.WIDTH * j, DefaultTextureSize.HEIGHT * i);
                    this.emptySpaces.push(point);
                }
            }
        }
        this.view.sortChildren();
        this.bonusGenerationLoop();
    };

    protected bonusGenerationLoop(): void {
        if (!app.mainGameModule.currentBonusOnMap) {
            this.createBonus(this.emptySpaces[_.random(0, this.emptySpaces.length - 1)]);
        }
        TweenMax.delayedCall(_.random(5, 8), () => this.bonusGenerationLoop());
    }

    protected createTextureByIndex(index: number, i: number, j: number) {
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
                sprite.zIndex = 1;
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
                let textureName: string;
                if (_.isEmpty(this.textureTankNames)) {
                    this.textureTankNames = _.cloneDeep(textureTankNames);
                    textureName = this.textureTankNames.shift();
                } else {
                    textureName = this.textureTankNames.shift();
                }
                texture = app.loader.getTextureByTypeName(textureName);
                sprite = new TankEnemy(texture, textureName, i, j);
                break;
            }
            case 7: {
                texture = app.loader.getTextureByTypeName(ElementTypeNames.EAGLE);
                sprite = new Board(texture, ElementTypeNames.EAGLE, i, j);
                break;
            }
        }
        if (sprite) {
            this.view.addChild(sprite);
        }
    };

    protected createBonus(point: PIXI.Point): void {
        if (point) {
            const textureTypeName = textureBonusNames[_.random(0, textureBonusNames.length - 1)];
            let texture = app.loader.getTextureByTypeName(textureTypeName);
            let sprite = new Bonus(texture, textureTypeName, point.x, point.y);
            this.view.addChild(sprite);
        }
    }

    public createLife(amount: number): void {
        let texture = app.loader.getTextureByTypeName(ElementTypeNames.HEART);
        for (let i = 0; i < DefaultParams.MAX_AMOUNT_LIFE + 1; i++) {
            const sprite = new Sprite(texture);
            // centeringItem(app.view, sprite);
            sprite.x += sprite.height * i;
            sprite.y = app.view.height - 50;
            sprite.visible = false;
            sprite.name = `life_${amount}`;
            this.lifeSprites.push(sprite);
            this.view.addChild(sprite);
        }

    }

    protected createBoardFromSmallBoard(i: number, j: number) {
        let board: Board;
        for (let k = 0; k <= 3; k++) {
            const texture = app.loader.getTextureByTypeName(ElementTypeNames.SMALL_WALL);
            board = new Board(texture, ElementTypeNames.SMALL_WALL, i, j);
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
