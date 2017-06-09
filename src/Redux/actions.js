import {
	LOGOUT,
	UPDATE_USER,
	UPDATE_CREDS,
	COGNITO_INITIAL_SETUP
} from './constants';


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


export const logout = () => ({
	type: LOGOUT
});
