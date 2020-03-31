import {Game} from './game/game';

const canvas = document.getElementsByTagName('canvas')[0];
canvas.height = 500;
canvas.width = 500;

const game = new Game(canvas);
game.start();
