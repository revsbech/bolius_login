import appConfig from '../config';
import AWS  from "aws-sdk";
import { getLoginsFromLocallyStoredAccessTokens } from './utils';

export const signInFacebook = (fbResponse, cb, history, props) => {

	let accessToken = fbResponse.accessToken;
	//Store facebook token in local storage to make it aveailble for the _getAwsIdentityCredentials
	localStorage.setItem('facebookAccessToken', accessToken);

	let creds = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: appConfig.IdentityPoolId,
		Logins: getLoginsFromLocallyStoredAccessTokens(props.state, appConfig)
	});

	creds.getPromise().then(() => {

		// Save credentials in the store
		props.updateCredentials(creds);

		if (cb && typeof cb === 'function') {
			cb();
		}

	}, err => {console.log('err', err)});
};
