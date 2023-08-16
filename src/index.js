import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import Synopsis from './Synopsis';

const diagram1 = new Synopsis(document.getElementById('root'));
const diagram2 = new Synopsis(document.getElementById('root'));

/*
const root = ReactDOM.createRoot(document.getElementById('root'));
  
root.render(
  <React.StrictMode>
    <Synopsis />
  </React.StrictMode>
);
*/
