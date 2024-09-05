import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import userReducer from './userSlice'; // Import the userReducer

export const store = configureStore({
  reducer: {
    game: gameReducer,
    user: userReducer, // Add userReducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
