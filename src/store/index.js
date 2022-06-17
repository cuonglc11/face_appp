import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from '../reducers';
import configs from '../constants/configs';

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const store = configs.development
  ? createStore(reducers, composeEnhancers(applyMiddleware(thunk)))
  : createStore(reducers, applyMiddleware(thunk));

export default store;
