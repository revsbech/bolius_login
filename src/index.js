import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { cognitoInitialSetup } from './Redux/actions';
import appConfig from './config';
import cognitoReducer from './Redux/reducers/cognito';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';


const history = createBrowserHistory();

let boliusLoginReducers = combineReducers({
	cognito: cognitoReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loginStore = createStore(
	connectRouter(history)(boliusLoginReducers),
	composeEnhancers(
		applyMiddleware(
			routerMiddleware(history),
			thunk
		)
	)
);

// Initial Cognito setup
loginStore.dispatch(cognitoInitialSetup({
	region: appConfig.region,
	UserPoolId: appConfig.UserPoolId,
	ClientId: appConfig.ClientId
}));

ReactDOM.render(
	<Provider store={loginStore}>
		<App history={history} />
	</Provider>,
	document.getElementById('root')
);
