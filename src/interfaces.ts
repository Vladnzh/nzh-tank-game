import Board from './modules/main-game-module/elements/board';
import Tank from './modules/main-game-module/elements/tank';
import TankEnemy from './modules/main-game-module/elements/tank-enemy';
import { AbstractTank } from './modules/main-game-module/elements/abstract-tank';
import Bonus from './modules/main-game-module/elements/bonus';

export type TypeItemsCollision = Board | Tank | TankEnemy | AbstractTank | Bonus
