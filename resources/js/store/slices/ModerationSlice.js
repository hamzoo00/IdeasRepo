import { createSlice } from '@reduxjs/toolkit';

const adminActionSlice = createSlice({
  name: 'adminAction',
  initialState: {
    adminActiontrigger: 0 , 
  },
  reducers: {
    
    setAdminActionTrigger: (state) => {
      state.adminActiontrigger += 1;
    },
  },
});

export const { setAdminActionTrigger } = adminActionSlice.actions;
export default adminActionSlice.reducer;