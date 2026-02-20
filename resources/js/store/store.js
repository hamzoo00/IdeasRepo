import { configureStore } from '@reduxjs/toolkit';
import {setUser, clearUser} from './slices/userDetailsSlice';

export const store = configureStore({
  reducer: {
    setUser: setUser,
    clearUser: clearUser,
  },
});
