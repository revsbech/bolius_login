
import {
	AuthenticationDetails,
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUser,
} from "amazon-cognito-identity-js";
import AWS  from "aws-sdk";
import "amazon-cognito-js"
import appConfig from "./config";

AWS.config.region = appConfig.region;

const auth = {
	poolData: {
		UserPoolId: appConfig.UserPoolId,
		ClientId: appConfig.ClientId,
	},

	userHasValidIdentitySession() {

		//Hack that simple checks localStorage
		if (localStorage.getItem("aws.cognito.identity-id." + appConfig.IdentityPoolId)) {
			console.log("Found in localstorage!!!");
			return true;
		}

		if (!AWS.config.credentials) {
			return false;
		}

		// @todo Instead of simple checking if the accessKeyId is present, we should make a call to credentials.get to make sure
		// the login is valid, but I cant figure out how to do this correctly since the credentials.get call is done async. Perhaps by issuing promies
		// that the routeHandler can check?
		/*
		return AWS.config.credentials.get((err) => {
			return true;
			console.log("Checking credentials");
			if (!err) {
				console.log("No error, credentials valid");
				return true;
			}
		});
		/**/


		if (AWS.config.credentials.accessKeyId) {
			return true;
		}
		return false;

	},
	userHasValidUserpoolSession() {
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

	getSyncedData(cb) {
		//@Should we somehow check if get call to credentials.get is really needed?
		AWS.config.credentials = this._getAwsIdentityCredentials();
		AWS.config.credentials.get(() => {
      let syncClient = new AWS.CognitoSyncManager();
    	syncClient.openOrCreateDataset('myTestDataSet', function (err, dataset) {
				dataset.getAllRecords(function (err, record) {
					let user = {};
					for (var i=0, l=record.length; i<l; i++) {
						user[record[i]["key"]] = record[i]["value"];
          }

					if (cb && typeof cb === 'function') {
						cb(user);
					}

				});
    });
  });

	},

	getPropertiesOfCurrentUser() {
		let cognitoUser = this._getCurrentUser();
		cognitoUser.getSession((err, session) => {
			if (!session) {
				return false;
			}
			cognitoUser.getUserAttributes(function(err, result) {
	      if (err) {
	        alert(err);
	        return;
	      }
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


	signInFacebook(fbResponse, cb, history) {
		let accessToken = fbResponse.accessToken;
		//Store facebook token in local storage to make it aveailble for the _getAwsIdentityCredentials
		localStorage.setItem('facebookAccessToken', accessToken);
		AWS.config.credentials = this._getAwsIdentityCredentials();

		AWS.config.credentials.get((err) => {


			if (err) return console.log("Error", err);
			//AWS.config.credentials
			//Do a sync of data from CognitoSync
			let syncClient = new AWS.CognitoSyncManager();
			syncClient.openOrCreateDataset('myTestDataSet', function(err, dataset) {
				if (fbResponse.name) {
					dataset.put('name', fbResponse.name, function(err, recod) {});
				}
				if (fbResponse.email) {
					dataset.put('email', fbResponse.email, function(err, record) {});
				}

				dataset.synchronize({
					onSuccess: function (data, newRecords) {
						cb();
					},
					onError: function(error) {
						console.log(error);
					}
				});
			});


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

		let cognitoUser = new CognitoUser(userData);

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: (result) => {
				// We register the user in the Identity pool in order to initiate a federeated Identity session which is what treats us as logged in.
				AWS.config.credentials = this._getAwsIdentityCredentials();
				AWS.config.credentials.get((err) => {
          if (err) return console.log("Error", err);
					if (cb && typeof cb === 'function') {
						//@Todo: We should the the name and email (and other fields) from the CongitoUser and save the in the dataset
						//Do a sync of data from CognitoSync
						let syncClient = new AWS.CognitoSyncManager();
						syncClient.openOrCreateDataset('myTestDataSet', function(err, dataset) {
              dataset.synchronize({
                onSuccess: function (data, newRecords) {
                  cb();
                },
                onError: function (error) {
                  console.log(error);
                }
              });
						});
					}
				});
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

		// Remove the facebook access token stored locally
		localStorage.removeItem('facebookAccessToken');

		// If signed in with username/password, log out of cognito UserPool
		let cognitoUser = this._getCurrentUser();
		if (cognitoUser) {
			cognitoUser.signOut();
		}

		//@Todo Would it not be cleaner with a promise?
		if (cb && typeof cb === 'function') {
			cb();
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

	getOpenIdTokenForCurrentUser() {
		let id = AWS.config.credentials.identityId;
		var params = {
			IdentityId: id,
			Logins: this._getLoginsFromLocallyStoredAccessTokens()
		};

		return new Promise((resolve, reject) => {
				let cognitoidentity  = new AWS.CognitoIdentity();
				cognitoidentity.getOpenIdToken(params, function(err,data) {
					//@todo handle if err != null (call reject)
					if (err != null) {
						reject(err);
					}
					resolve(data.Token);
				});

		});

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
	},

  /**
	 * Build theAwsCognitoIdentityCredentials based on alle the current logins (facebook, UserPool etc)
	 *
   * @returns {CognitoIdentityCredentials}
   * @private
   */
	_getAwsIdentityCredentials() {

		// First check if logged in to UserPool

    return new AWS.CognitoIdentityCredentials({
      IdentityPoolId: appConfig.IdentityPoolId,
      Logins: this._getLoginsFromLocallyStoredAccessTokens()
    });
	},

	_getLoginsFromLocallyStoredAccessTokens() {
		let logins = {};
		if (this.userHasValidUserpoolSession()) {
			let cognitoKey = 'cognito-idp.' + appConfig.region + '.amazonaws.com/' + appConfig.UserPoolId;
			logins[cognitoKey] = this.getIdTokenOfCurrentUser().getJwtToken();
		}

		let facebookAccessToken = localStorage.getItem('facebookAccessToken');
		if (facebookAccessToken && facebookAccessToken !== "null") {
			logins['graph.facebook.com'] = facebookAccessToken
		}
		return logins;
	}
};

export default auth;