import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/userSlice';
import { latentAPI } from './services/latentAPI';

export const store = configureStore({
  reducer: {
    [latentAPI.reducerPath]: latentAPI.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(latentAPI.middleware),
});
