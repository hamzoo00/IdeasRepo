import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; 
import storageSession from 'redux-persist/lib/storage/session';
import rootReducer from './rootReducer'; 

 
const persistConfig = {
  key: 'root'  ,
  storage: storageSession,
  whitelist: ['auth'], 
  // blacklist: ['temp'] // these will be cleared on refresh
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);