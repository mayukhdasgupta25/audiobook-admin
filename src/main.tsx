import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import App from './App';
import AuthInitializer from './components/common/AuthInitializer';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <Provider store={store}>
         <AuthInitializer />
         <App />
         <Toaster />
      </Provider>
   </React.StrictMode>
);

