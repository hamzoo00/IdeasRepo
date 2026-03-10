import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/userDetailsSlice';
import adminActionSlice from './slices/ModerationSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  adminAction: adminActionSlice,
});

export default rootReducer;