export class StartGameNames {
    static readonly TITLE = 'THE TANKS';
}

export class EVENT_NAMES {
    static readonly MOUSEDOWN = 'mousedown';
    static readonly MOUSEUP = 'mouseup';
    static readonly KEYDOWN = 'keydown';
    static readonly KEYUP = 'keyup';
}

export class DIRECTION_NAMES {
    static readonly DOWN = 'DOWN';
    static readonly UP = 'UP';
    static readonly LEFT = 'LEFT';
    static readonly RIGHT = 'RIGHT';
}

export class END_GAME_NAMES {
    static readonly YOU_WON = 'YOU WON';
    static readonly YOU_DIED = 'GAME OVER';
}

export class ElementTypeNames {
    static readonly LOADER_BAR = 'loaderBar';
    static readonly LOADER_BG = 'loaderBg';
    static readonly EAGLE = 'eagle';
    static readonly LEAVES = 'leaves';
    static readonly WALL = 'wall';
    static readonly SMALL_WALL = 'smallWall';
    static readonly WATER = 'water';
    static readonly BONUS_IMMORTAL = 'bonusImmortal';
    static readonly BONUS_LIVE = 'bonusLive';
    static readonly BONUS_SLOW = 'bonusSlow';
    static readonly BONUS_SPEED = 'bonusSpeed';
    static readonly TANK = 'tank';
    static readonly TANK_ENEMY_BLUE = 'enemyBlue';
    static readonly TANK_ENEMY_RED = 'enemyRed';
    static readonly TANK_ENEMY_WHITE = 'enemyWhite';
    static readonly START_BUTTON = 'startButton';
    static readonly BULLET = 'bullet';
    static readonly BULLET_ENEMY = 'bulletEnemy';
    static readonly HEART = 'heart';
    static readonly PAUSE_BUTTON = 'pause';
    static readonly PLAY_BUTTON = 'play';
}

export class SoundNames {
    static readonly BONUS = 'bonusSound';
    static readonly EXPLODE = 'explodeSound';
    static readonly HIT = 'hitSound';
    static readonly LOSE = 'loseSound';
    static readonly SHOT = 'shotSound';
    static readonly WIN = 'winSound';
}

export class AnimationsNames {
    static readonly ANIMATIONS = 'animations';
    static readonly APPEAR_SPRITE = 'appear';
    static readonly EXPLODE_SPRITE = 'explode';
    static readonly EXPLODE_SMALL_SPRITE = 'explode_small';
}

export class DefaultTextureSize {
    static readonly WIDTH = 36;
    static readonly HEIGHT = 36;
}

export class LoaderNames {
    static readonly TITLE = 'Loading...';
}

export class DefaultParams {
    static readonly TRANSITION_VIEW_DURATION: number = 1;
    static readonly TANK_SPEED: number = 1;
    static readonly BULLET_SPEED: number = 5;
    static readonly BONUS_EXPIRATION_TIME: number = 4;
    static readonly BONUS_IMMORTAL_EXPIRATION_TIME: number = 4;
    static readonly RECHARGE_TIME: number = 1.5;
    static readonly AMOUNT_LIFE: number = 0;
    static readonly MAX_AMOUNT_LIFE: number = 3;
}
