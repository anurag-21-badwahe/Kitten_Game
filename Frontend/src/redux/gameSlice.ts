import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CardType = 'Cat' | 'Defuse' | 'Shuffle' | 'Exploding Kitten';

interface GameState {
  deck: CardType[];
  drawnCards: CardType[];
  defuseCardCount: number;
  gameOver: boolean;
  playerWon: boolean;
}

const initialState: GameState = {
  deck: [],
  drawnCards: [],
  defuseCardCount: 0,
  gameOver: false,
  playerWon: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state) {
      state.deck = shuffleDeck(['Cat', 'Defuse', 'Shuffle', 'Exploding Kitten', 'Cat']);
      state.drawnCards = [];
      state.defuseCardCount = 0;
      state.gameOver = false;
      state.playerWon = false;
    },
    drawCard(state) {
      if (state.gameOver || state.deck.length === 0) return;
      
      const card = state.deck.pop();
      if (card) {
        state.drawnCards.push(card);
        if (card === 'Exploding Kitten') {
          if (state.defuseCardCount > 0) {
            state.defuseCardCount--;
          } else {
            state.gameOver = true;
          }
        } else if (card === 'Defuse') {
          state.defuseCardCount++;
        } else if (card === 'Shuffle') {
          state.deck = shuffleDeck(['Cat', 'Defuse', 'Shuffle', 'Exploding Kitten', 'Cat']);
        }
      }

      if (state.deck.length === 0 && !state.gameOver) {
        state.playerWon = true;
        state.gameOver = true;
      }
    },
  },
});

export const { startGame, drawCard } = gameSlice.actions;

export default gameSlice.reducer;

function shuffleDeck(deck: CardType[]): CardType[] {
  return deck.sort(() => Math.random() - 0.5);
}
