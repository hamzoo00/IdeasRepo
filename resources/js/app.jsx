import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App';
import "../css/app.css";
import { store } from './store/store';
import { Provider } from 'react-redux';
const root = createRoot(document.getElementById('app'));

root.render(
    
    <BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>    
    </BrowserRouter>
);
