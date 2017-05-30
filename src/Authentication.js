
import {
	AuthenticationDetails,
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUser,
} from "amazon-cognito-identity-js";
import {config, CognitoIdentityCredentials} from "aws-sdk";
import appConfig from "./config";

const auth = {
	poolData: {
		UserPoolId: appConfig.UserPoolId,
		ClientId: appConfig.ClientId,
	},

	userHasValidSession() {
		let cognitoUser = this._getCurrentUser();

		if (!cognitoUser) return false;

		return cognitoUser.getSession((err, session) => {
			if (!session) {
				//throw(err); // have your route handler toss user back to login route
				return false
			}

			return session.isValid();
		});
	},
	getIdTokenOfCurrentUser() {
		let cognitoUser = this._getCurrentUser();

		if (!cognitoUser) return false;

		return cognitoUser.getSession((err, session) => {
			if (!session) {
				//throw(err); // have your route handler toss user back to login route
				return false
			}

			return session.getIdToken();
		});

	},
	getPropertiesOfCurrentUser() {
		let cognitoUser = this._getCurrentUser();

		console.log(cognitoUser);
		cognitoUser.getSession((err, session) => {
			if (!session) {
				return false;
			}
			cognitoUser.getUserAttributes(function(err, result) {
	      if (err) {
	        alert(err);
	        return;
	      }
	      console.log(result);
	      return result;
	    });

    });

	},

	confirmEmail(email, confirmationCode, cb) {
		let cognitoUser = this._getCognitoUser(email);

		cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
			if (err) {
				alert(err);
				return;
			}

			if (cb && typeof cb === 'function') {
				cb();
			}
		});
	},

	signUp(email, password, cb) {
		let userPool = this._getUserPool();

		const attributeList = [
			new CognitoUserAttribute({
				Name: 'email',
				Value: email,
			})
		];
		userPool.signUp(email, password, attributeList, null, (err, result) => {
			if (err) {
				alert(err);
				return;
			}

			if (cb && typeof cb === 'function') {
				cb();
			}
		});

	},

	signInFacebook(accesstoken, cb, history) {
		config.region = appConfig.region
			//"eu-central-1";
		config.credentials = new CognitoIdentityCredentials({
			IdentityPoolId: appConfig.IdentityPoolId,
			Logins: {
				'graph.facebook.com': accesstoken,
			}
    });
		//'eu-central-1:623e48e1-a865-4a64-b0e1-75c9faac18bb'

		config.credentials.get(function(err) {
			if (err) return console.log("Error", err);
			//console.log(config.credentials);
			alert("Login ok. Your Cognito Identity ID is " + config.credentials.identityId)
			/**
			console.log("Identity ID: " + config.credentials.identityId);
			console.log("access key: " + config.credentials.accessKeyId);
			cogId = new CognitoIdentity()
			cogId.describeIdentity({})
			 */

			// @todo finde the User associate dwith this  identified with this ID.

			//let user = CognitoIdentityServiceProvider.(userData);
			/*
			let provider = new CognitoIdentityServiceProvider();

			let user = provider.getUser({
				AccessToken: config.credentials.accessKeyId
			});
			console.log(user);
			/**/

		});


	},

	signIn(email, password, cb, history) {

		let authenticationData = {
			Username : email,
			Password : password,
		};
		let authenticationDetails = new AuthenticationDetails(authenticationData);

		let userPool = this._getUserPool();
		let userData = {
			Username : email,
			Pool : userPool
		};

		// Should this not be with the identity provider, instead of the raw user
		//let cognitoUser = new CognitoIdentityServiceProvider.CognitoUser(userData);

		let cognitoUser = new CognitoUser(userData);

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				if (cb && typeof cb === 'function') {
					cb();
				}
			},

			onFailure: function(err) {
				if (err.name === 'UserNotConfirmedException') {
					history.push('/confirm-email');
				} else {
					alert(err);
				}
			},

		});
	},

	signOut(cb) {
		let cognitoUser = this._getCurrentUser();
		if (cognitoUser) {
			cognitoUser.signOut();
			if (cb && typeof cb === 'function') {
				cb();
			}
		} else {
			throw new Error('No instance of cognitoUser to sign out!');
		}
	},

	deleteUser(cb) {
		let cognitoUser = this._getCurrentUser();
		cognitoUser.getSession(Function.prototype);

		if (cognitoUser) {
			cognitoUser.deleteUser(function(err, result) {
				if (err) {
					alert(err);
					return;
				}

				if (cb && typeof cb === 'function') {
					cb();
				}
			});
		} else {
			throw new Error('No instance of cognitoUser to delete!');
		}
	},

	_getUserPool() {
		return new CognitoUserPool(this.poolData);
	},

	_getCurrentUser() {
		let userPool = this._getUserPool();
		return userPool.getCurrentUser();
	},

	_getCognitoUser(email) {
		let userPool = this._getUserPool();
		let currentUser = this._getCurrentUser();

		let userData = {
			Username : email || currentUser.username,
			Pool : userPool
		};
		return new CognitoUser(userData);
	}
};

export default auth;