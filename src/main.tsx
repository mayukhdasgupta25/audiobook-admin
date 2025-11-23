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
         <Toaster
            position="top-right"
            toastOptions={{
               duration: 5000,
               style: {
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
               },
               error: {
                  style: {
                     background: '#fee2e2',
                     color: '#991b1b',
                     border: '1px solid #fca5a5',
                  },
               },
               success: {
                  style: {
                     background: '#dcfce7',
                     color: '#166534',
                     border: '1px solid #86efac',
                  },
               },
            }}
         />
      </Provider>
   </React.StrictMode>
);

