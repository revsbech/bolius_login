

export const signInFacebook = (fbResponse, cb, history, props) => {
	let accessToken = fbResponse.accessToken;

	//Store facebook token in local storage to make it available for the _getAwsIdentityCredentials
	localStorage.setItem('facebookAccessToken', accessToken);

  props.history.push('/dashboard');

};
