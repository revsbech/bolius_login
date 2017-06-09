import {
	LOGOUT,
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
