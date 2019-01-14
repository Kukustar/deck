import gameOptions from './game-options';
import bootGame from '../scenes/boot-game';
import playGame from '../scenes/play-game';

export default {
  width: gameOptions.boardSize.cols * (gameOptions.titleSize +
        gameOptions.titleSpacing) + gameOptions.titleSpacing,
  height: gameOptions.boardSize.rows * (gameOptions.titleSize +
        gameOptions.titleSpacing) + gameOptions.titleSpacing,
  backgroundColor: 0xecf0f1,
  scene: [bootGame, playGame],
};

