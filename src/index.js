import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import TableParam from './TableParam'

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<TableParam />, document.getElementById('tableParam'));
registerServiceWorker();
