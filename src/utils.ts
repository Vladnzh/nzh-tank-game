import * as PIXI from 'pixi.js';
import { ElementTypeNames } from './modules/constants';
import { TypeItemsCollision } from './interfaces';
import Bullet from './modules/main-game-module/elements/bullet';

export const centeringItem = (view: HTMLCanvasElement | PIXI.Container, item: PIXI.Container): PIXI.Point => {
    const position = new PIXI.Point();
    position.x = (view.width - item.width) / 2;
    position.y = (view.height - item.height) / 2;
    return position;
};

export const itemsIntersect = (a: any, b: any): boolean => {
    if (!a || !b) {
        return false;
    }
    if (a.type === b.type) {
        return false;
    }
    const ab = a.getBounds();
    const bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
};

export const isIgnoreTypeForBullet = (type: string): boolean => {
    return type === ElementTypeNames.LEAVES
        || type === ElementTypeNames.WATER
        || type === ElementTypeNames.BONUS_SPEED
        || type === ElementTypeNames.BONUS_IMMORTAL
        || type === ElementTypeNames.BONUS_LIVE
        || type === ElementTypeNames.BONUS_SLOW;
};

export const isIgnoreTypeForTank = (type: string): boolean => {
    return type === ElementTypeNames.LEAVES;
};

export const isAnyTank = (item: TypeItemsCollision): boolean => {
    return item.type === ElementTypeNames.TANK
        || item.type === ElementTypeNames.TANK_ENEMY_WHITE
        || item.type === ElementTypeNames.TANK_ENEMY_BLUE
        || item.type === ElementTypeNames.TANK_ENEMY_RED;
};

export const isAnyBullet = (item: TypeItemsCollision | Bullet): boolean => {
    return item.type === ElementTypeNames.BULLET || item.type === ElementTypeNames.BULLET_ENEMY;
};

export const textureTankNames: Array<string> = [
    ElementTypeNames.TANK_ENEMY_RED,
    ElementTypeNames.TANK_ENEMY_BLUE,
    ElementTypeNames.TANK_ENEMY_WHITE,
];
export const textureBonusNames: Array<string> = [
    ElementTypeNames.BONUS_SLOW,
    ElementTypeNames.BONUS_LIVE,
    ElementTypeNames.BONUS_IMMORTAL,
    ElementTypeNames.BONUS_SPEED,
];

export const titleStyle: Object = {
    dropShadow: true,
    dropShadowAlpha: 0.2,
    dropShadowBlur: 4,
    dropShadowDistance: 8,
    fill: [
        '#3f5568',
        '#0a1f2f',
    ],
    fillGradientStops: [
        0.50,
        0.1,
    ],
    fontFamily: 'Arial Black',
    fontSize: 100,
    fontWeight: 'bold',
    miterLimit: 15,
    strokeThickness: 6,
};
export const mapMatrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 3, 0, 0, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 0, 0, 0, 3, 2, 2, 0, 0, 1],
    [1, 0, 0, 2, 2, 3, 0, 0, 0, 3, 3, 3, 0, 2, 0, 3, 3, 3, 0, 0, 0, 0, 3, 2, 2, 0, 0, 1],
    [1, 0, 0, 2, 2, 3, 0, 0, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 0, 0, 0, 3, 2, 2, 0, 0, 1],
    [1, 0, 0, 2, 2, 3, 0, 0, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 0, 0, 0, 3, 2, 2, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1],
    [1, 0, 0, 0, 0, 4, 4, 4, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 4, 4, 4, 0, 0, 3, 3, 1],
    [1, 1, 1, 2, 2, 4, 4, 4, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 4, 4, 4, 2, 2, 1, 1, 1],
    [1, 3, 3, 0, 0, 4, 4, 4, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 4, 4, 4, 0, 0, 0, 0, 1],
    [1, 3, 3, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 2, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 5, 0, 0, 0, 0, 2, 0, 0, 2, 2, 3, 2, 0, 0, 1],
    [1, 0, 2, 2, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 3, 2, 0, 0, 1],
    [1, 0, 3, 2, 3, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 3, 2, 0, 0, 1],
    [1, 0, 3, 2, 3, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 2, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 6, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 2, 3, 0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 7, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
