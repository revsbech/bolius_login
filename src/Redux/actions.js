import { push } from 'connected-react-router'

import {
	LOGOUT,
	UPDATE_USER,
	UPDATE_CREDS,
	COGNITO_INITIAL_SETUP,
	GET_CREDENTIALS_REQUEST,
	GET_CREDENTIALS_SUCCESS,
	GET_CREDENTIALS_ERROR
} from './constants';


export function getCredentials (currentCredsFromLocalStorage, props) {
	return (dispatch) => {
		dispatch(getCredentialsRequest());
		return currentCredsFromLocalStorage.getPromise()
			.then(() => {
				dispatch(getCredentialsSuccess(currentCredsFromLocalStorage));
				dispatch(push('/dashboard'));
			})
			.catch((error) => {
				if (error.name === 'NotAuthorizedException') {
					dispatch(logout(props.state));
					dispatch(push('/signin'));
				} else {
					dispatch(getCredentialsError(error));
				}
			});
	}
}

export function getCredentialsRequest() {
	return {
		type: GET_CREDENTIALS_REQUEST
	};
}

export function getCredentialsSuccess(creds) {
	return {
		type: GET_CREDENTIALS_SUCCESS,
		payload: {
			creds
		}
	};
}

export function getCredentialsError(error) {
	return {
		type: GET_CREDENTIALS_ERROR,
		payload: {
			error
		}
	};
}

export function updateCredentials(credentials) {
	return {
		type: UPDATE_CREDS,
		payload: {
			credentials
		}
	};
}

export function updateUser(user) {
	return {
		type: UPDATE_USER,
		payload: {
			user
		}
	};
}

export function cognitoInitialSetup(config) {
	return {
		type: COGNITO_INITIAL_SETUP,
		payload: {
			config
		}
	};
}


export const logout = (user) => {
	if (user && typeof user.signOut === 'function' ) {
		user.signOut();
		localStorage.removeItem('facebookAccessToken');
	}
	return {
		type: LOGOUT
	};
};

