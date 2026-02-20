import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App';
import "../css/app.css";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../js/store/store';

const root = createRoot(document.getElementById('app'));

root.render(
    
    <BrowserRouter>
     <Provider store={store}>
      <PersistGate persistor={persistor}>

        <App />

      </PersistGate>
     </Provider>    
    </BrowserRouter>
);
