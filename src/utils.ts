import * as PIXI from 'pixi.js';

export const centeringItem = (view: HTMLCanvasElement | PIXI.Container, item: PIXI.Container ): PIXI.Point => {
    const position = new PIXI.Point();
    position.x = (view.width - item.width) / 2;
    position.y = (view.height - item.height) / 2;
    return position;
};
