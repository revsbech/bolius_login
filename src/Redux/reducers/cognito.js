import {
	LOGOUT,
	UPDATE_USER,
	UPDATE_CREDS,
	COGNITO_INITIAL_SETUP
} from '../constants';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AWS  from 'aws-sdk';

// ------------------------------------
// INITIAL STATE
// ------------------------------------
const initialState = {
	credentials: null,
	userPool: null,
	user: null
};


// ------------------------------------
// AWS Cognito initial setup
// ------------------------------------
const initialSetup = (state, action) => {
	// surprise side-effect!
	AWS.config.region = action.payload.config.region;
	const pool = new CognitoUserPool({
		UserPoolId: action.payload.config.UserPoolId,
		ClientId: action.payload.config.ClientId,
	});
	const user = pool.getCurrentUser();
	return Object.assign({}, state, {
		userPool: pool,
		user,
	});
};


// ------------------------------------
// REDUCER
// ------------------------------------
const ACTION_HANDLERS = {
	[COGNITO_INITIAL_SETUP]: (state, action) => {
		return initialSetup(state, action);
	},
	[UPDATE_USER]: (state, action) => {
		return Object.assign({}, state, {
			user: action.payload.user
		});
	},
	[UPDATE_CREDS]: (state, action) => {
		return Object.assign({}, state, {
			credentials: action.payload.credentials
		});
	},
	[LOGOUT]: (state, action) => {
		return Object.assign({}, state, {
			credentials: null,
			user: null
		});
	}
};

export default function reducer (state = initialState, action) {
	const handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state
};