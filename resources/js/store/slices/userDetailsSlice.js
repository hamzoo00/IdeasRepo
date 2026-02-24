import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, 
  },
  reducers: {
    
    setUser: (state, action) => {
      state.user = action.payload; 
    },
   
    clearUser: (state) => {
      sessionStorage.removeItem(state.user?.type);
      state.user = null;
      sessionStorage.removeItem('auth_token');
      localStorage.removeItem('last_active_time');
      sessionStorage.removeItem('persist:root');
    
   
    },

  },
});

export const { setUser, clearUser, } = authSlice.actions;
export default authSlice.reducer;