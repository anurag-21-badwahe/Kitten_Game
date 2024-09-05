import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  wins: number;
}

const initialState: UserState = {
  username: '',
  wins: 0,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    incrementWins(state) {
      state.wins++;
    },
  },
});

export const { setUsername, incrementWins } = userSlice.actions;

export default userSlice.reducer;
