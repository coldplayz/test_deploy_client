import { createSlice } from '@reduxjs/toolkit';

// const initialState = {};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    isAgent: false,
  },
  reducers: {
    setUser: (state, action) => {
      // console.log('payload: ', action.payload);
      state.user = action.payload;
      // console.log('state.user: ', state.user);
      state.isAgent = action.payload?.isAgent;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
