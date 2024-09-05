import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  wins: number;
}

interface GameState {
  deck: string[];
  username: string;
  leaderboard: User[];
  gameStatus: 'not_started' | 'playing' | 'won' | 'lost';
  defuseCount: number;
  isGameOver: boolean;
}

const initialState: GameState = {
  deck: [],
  username: '',
  leaderboard: [],
  gameStatus: 'not_started',
  defuseCount: 0,
  isGameOver: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state) {
      const cards = ['😼', '🙅‍♂️', '🔀', '💣', '💣'];
      state.deck = cards.sort(() => Math.random() - 0.5);
      state.gameStatus = 'playing';
      state.isGameOver = false;
      state.defuseCount = 1;
    },
    drawCard(state) {
      if (state.isGameOver || state.deck.length === 0) return;
      const drawnCard = state.deck.shift() as string;
      if (drawnCard === '💣') {
        if (state.defuseCount > 0) {
          state.defuseCount -= 1;
          state.gameStatus = 'playing';
        } else {
          state.gameStatus = 'lost';
          state.isGameOver = true;
        }
      } else if (drawnCard === '🔀') {
        state.deck = ['😼', '🙅‍♂️', '🔀', '💣', '💣'].sort(() => Math.random() - 0.5);
      } else if (drawnCard === '🙅‍♂️') {
        // Do nothing, defuse card is just removed
      }
      if (state.deck.length === 0 && state.gameStatus === 'playing') {
        state.gameStatus = 'won';
        state.isGameOver = true;
      }
    },
    addUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    updateLeaderboard(state) {
      if (state.gameStatus === 'won') {
        const existingUser = state.leaderboard.find(user => user.username === state.username);
        if (existingUser) {
          existingUser.wins += 1;
        } else {
          state.leaderboard.push({ username: state.username, wins: 1 });
        }
      }
    },
  },
});

export const { startGame, drawCard, addUsername, updateLeaderboard } = gameSlice.actions;

export default gameSlice.reducer;