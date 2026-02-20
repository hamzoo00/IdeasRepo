import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/userDetailsSlice';

const rootReducer = combineReducers({
  auth: authSlice,
});

export default rootReducer;