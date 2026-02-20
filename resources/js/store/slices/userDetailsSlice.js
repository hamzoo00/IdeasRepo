import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, 
    userImage: null,
  },
  reducers: {
    
    setUser: (state, action) => {
      state.user = action.payload; 
    },
   
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('persist:root');
      localStorage.removeItem('student');
      localStorage.removeItem('teacher');
      localStorage.removeItem('admin');
    },

  },
});

export const { setUser, clearUser, } = authSlice.actions;
export default authSlice.reducer;