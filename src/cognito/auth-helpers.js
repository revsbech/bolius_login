import appConfig from '../config';
import AWS  from "aws-sdk";
import { getLoginsFromLocallyStoredAccessTokens } from './utils';
import { updateCredentials, getCredentials, logout } from '../Redux/actions';

export const userHasValidIdentitySession = (props) => {
	let creds = props.state.cognito.credentials;
	if (creds && !creds.expired && !creds.needsRefresh()) {
		return true;

	} else if (creds && creds.needsRefresh()) {
		creds.refreshPromise().then(() => {

			// Save refreshed credentials in the store
			props.dispatch(updateCredentials(creds));

			props.history.push(props.path);

		}, err => {
			props.dispatch(logout(props.state.cognito.user));
			props.history.push('/signin');
		});
	} else {
		let creds = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: appConfig.IdentityPoolId,
			Logins: getLoginsFromLocallyStoredAccessTokens(props.state, appConfig)
		});

		props.dispatch(getCredentials(creds, props));
	}
};

export const signOut = (props) => {
	// Remove the facebook access token stored locally
	localStorage.removeItem('facebookAccessToken');

	// If signed in with username/password, log out of cognito UserPool
	let cognitoUser = props.state.cognito.user;
	if (cognitoUser) {
		cognitoUser.signOut();
	}

	// Clear state in store
	props.logout();

	// Redirect to signin
	props.history.push('/signin');
};


export const getCredentialsFromLocalStorage = (state, appConfig) => {
	return new AWS.CognitoIdentityCredentials({
		IdentityPoolId: appConfig.IdentityPoolId,
		Logins: getLoginsFromLocallyStoredAccessTokens(state, appConfig)
	});
};


