/**
 *
 * @param userPool
 * @returns {boolean}
 */
export const userHasValidUserpoolSession = userPool => {
	let cognitoUser = userPool.getCurrentUser();

	if (!cognitoUser) return false;

	return cognitoUser.getSession((err, session) => {
		if (!session) {
			//throw(err); // have your route handler toss user back to login route
			return false
		}

		return session.isValid();
	});
};

/**
 *
 * @param userPool
 * @returns {token}
 */
export const getIdTokenOfCurrentUser = userPool => {
	let cognitoUser = userPool.getCurrentUser();

	if (!cognitoUser) return false;

	return cognitoUser.getSession((err, session) => {
		if (!session) {
			//throw(err); // have your route handler toss user back to login route
			return false
		}

		return session.getIdToken();
	});
};

/**
 *
 * @param state
 * @returns {{}} - Object with current login tokens
 */
export const getLoginsFromLocallyStoredAccessTokens = (state, appConfig) => {
	let logins = {};
	if (userHasValidUserpoolSession(state.cognito.userPool)) {
		let cognitoKey = 'cognito-idp.' + appConfig.region + '.amazonaws.com/' + appConfig.UserPoolId;
		logins[cognitoKey] = getIdTokenOfCurrentUser(state.cognito.userPool).getJwtToken();
	}

	let facebookAccessToken = localStorage.getItem('facebookAccessToken');
	if (facebookAccessToken && facebookAccessToken !== "null") {
		logins['graph.facebook.com'] = facebookAccessToken
	}
	return logins;
};