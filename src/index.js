import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { ratesReducer, watchRequest } from './reducers/ratesReducer';
import './index.scss';

import App from './App';

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({ ratesReducer });

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(watchRequest);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
