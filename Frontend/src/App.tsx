import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, drawCard, addUsername, updateLeaderboard } from './redux/gameSlice';
import { TextField, Button, Typography, List, ListItem } from '@mui/material';

interface AppState {
  deck: string[];
  username: string;
  gameStatus: 'not_started' | 'playing' | 'won' | 'lost';
  isGameOver: boolean;
  leaderboard: { username: string; wins: number }[];
}

function App() {
  const dispatch = useDispatch();
  const { deck, username, gameStatus, isGameOver, leaderboard } = useSelector((state: AppState) => state);

  const handleStartGame = () => {
    dispatch(startGame());
  };

  const handleDrawCard = () => {
    dispatch(drawCard());
  };

  const handleSetUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(addUsername(event.target.value));
  };

  const handleUpdateLeaderboard = () => {
    dispatch(updateLeaderboard());
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4">Card Game</Typography>
      {gameStatus === 'not_started' && (
        <div>
          <TextField label="Username" variant="outlined" onChange={handleSetUsername} />
          <Button onClick={handleStartGame}>Start Game</Button>
        </div>
      )}
      {gameStatus === 'playing' && (
        <div>
          <Button onClick={handleDrawCard}>Draw Card</Button>
          <Typography variant="h6">Deck: {deck.join(' ')}</Typography>
        </div>
      )}
      {gameStatus === 'won' && (
        <div>
          <Typography variant="h6">Congratulations! You won!</Typography>
          <Button onClick={handleUpdateLeaderboard}>Update Leaderboard</Button>
        </div>
      )}
      {gameStatus === 'lost' && (
        <Typography variant="h6">Game Over. You lost!</Typography>
      )}
      <Typography variant="h5">Leaderboard</Typography>
      <List>
        {leaderboard.map((user, index) => (
          <ListItem key={index}>{user.username}: {user.wins} wins</ListItem>
        ))}
      </List>
    </div>
  );
}

export default App;