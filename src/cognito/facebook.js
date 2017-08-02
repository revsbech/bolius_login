import {getSuccessRedirectUrl, resetRedirectUrls} from "./url-helpers";

export const signInFacebook = (fbResponse, cb, history, props) => {
	let accessToken = fbResponse.accessToken;

	//Store facebook token in local storage to make it aveailble for the _getAwsIdentityCredentials
	localStorage.setItem('facebookAccessToken', accessToken);

	const successUrl = getSuccessRedirectUrl();
	if (successUrl) {
    resetRedirectUrls();
		window.location = successUrl;
	}

  props.history.push('/dashboard');

};