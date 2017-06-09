import appConfig from '../config';
import AWS  from "aws-sdk";
import { getLoginsFromLocallyStoredAccessTokens } from './utils';
import { updateCredentials} from '../Redux/actions';


export const signInFacebook = (fbResponse, cb, history, props) => {
	let accessToken = fbResponse.accessToken;

	//Store facebook token in local storage to make it aveailble for the _getAwsIdentityCredentials
	localStorage.setItem('facebookAccessToken', accessToken);
	history.push('/dashboard')
};


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
			props.history.push('/signin');
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
			props.history.push('/signin');
		});

	}
};
