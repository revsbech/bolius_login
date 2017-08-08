import appConfig from '../config';
import AWS  from "aws-sdk";
import { getLoginsFromLocallyStoredAccessTokens } from './utils';
import { updateCredentials } from '../Redux/actions';
import {resetRedirectUrls} from "./url-helpers";


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
			console.log('err', err);
			props.history.push('/');
		});
	} else {
		let creds = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: appConfig.IdentityPoolId,
			Logins: getLoginsFromLocallyStoredAccessTokens(props.state, appConfig)
		});

		creds.getPromise().then(() => {

			// Save credentials in the store
			props.dispatch(updateCredentials(creds));

			props.history.push(props.path);


		}, err => {
			console.log('err', err);
			props.history.push('/');
		});

	}
};

export const signOut = (props) => {
	// Remove the facebook access token stored locally
	localStorage.removeItem('facebookAccessToken');
	localStorage.removeItem('twitterAccessToken');
	localStorage.removeItem('googleAccessToken');
	localStorage.removeItem('linkedinAccessToken');
	resetRedirectUrls();

	// If signed in with username/password, log out of cognito UserPool
	let cognitoUser = props.state.cognito.user;
	if (cognitoUser) {
		cognitoUser.signOut();
	}

	//@todo We need to make sure that we sign out of Cognito as well!!

	// Clear state in store
	props.logout();

	// Redirect to signin
	props.history.push('/');
};


export const getCredentials = (state, appConfig) => {
	return new AWS.CognitoIdentityCredentials({
		IdentityPoolId: appConfig.IdentityPoolId,
		Logins: getLoginsFromLocallyStoredAccessTokens(state, appConfig)
	});
};


