import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import boliusLoginReducers from './Redux/reducers';
import { cognitoInitialSetup } from './Redux/actions';
import appConfig from './config';


const loginStore = createStore(
	boliusLoginReducers,
	applyMiddleware(ReduxThunk)
);

// Initial Cognito setup
loginStore.dispatch(cognitoInitialSetup({
	region: appConfig.region,
	UserPoolId: appConfig.UserPoolId,
	ClientId: appConfig.ClientId
}));

ReactDOM.render(
	<Provider store={loginStore}>
		<App />
	</Provider>,
	document.getElementById('root')
);
