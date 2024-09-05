import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux';
import { startGame, drawCard } from '../redux/gameSlice';

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const { deck, drawnCards, defuseCardCount, gameOver, playerWon } = useSelector((state: RootState) => state.game);

  const handleStart = () => dispatch(startGame());
  const handleDraw = () => dispatch(drawCard());

  return (
    <div>
      <h1>Card Game</h1>
      <button onClick={handleStart}>Start Game</button>

      {!gameOver && deck.length > 0 && (
        <button onClick={handleDraw}>Draw Card</button>
      )}

      <div>
        <h3>Drawn Cards:</h3>
        <ul>
          {drawnCards.map((card, index) => (
            <li key={index}>{card}</li>
          ))}
        </ul>
      </div>

      {gameOver && (
        <div>
          {playerWon ? <h2>You Win!</h2> : <h2>You Lost! 💣</h2>}
        </div>
      )}
    </div>
  );
};

export default Game;
