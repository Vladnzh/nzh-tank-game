import Board from './modules/main-game-module/map/elements/board';
import Tank from './modules/main-game-module/map/elements/tank';
import TankEnemy from './modules/main-game-module/map/elements/tank-enemy';
import { AbstractTank } from './modules/main-game-module/map/elements/abstract-tank';
import Bonus from './modules/main-game-module/map/elements/bonus';

export type TypeItemsCollision = Board | Tank | TankEnemy | AbstractTank | Bonus
