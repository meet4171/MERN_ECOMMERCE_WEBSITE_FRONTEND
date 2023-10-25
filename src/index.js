import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { store } from './app/store';
import App from './App';
import './index.css';


const container = document.getElementById('root');
const root = createRoot(container);

const RootComponent = () => {
  

  return (
    <React.StrictMode>
      <Provider store={ store }>

         <App /> 
      </Provider>
    </React.StrictMode>
  );
};

root.render(<RootComponent />);
