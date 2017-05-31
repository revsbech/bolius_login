
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

		if (!AWS.config.credentials) {
			console.log("No credentials");
			return false;
		}
		// @todo I'm not sure how this is validated, perhaps by calling AWS.config.credentials.get og getPromise?
		if (AWS.config.credentials.accessKeyId) {
			return true;
		}
		return false;
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

	getSyncedData(cb) {
		//@Should we somehow check if get call to credentials.get is really needed?
		AWS.config.credentials = this._getAwsIdentityCredentials();
		AWS.config.credentials.get(() => {
      let syncClient = new AWS.CognitoSyncManager();
    	syncClient.openOrCreateDataset('myTestDataSet', function (err, dataset) {
				dataset.getAllRecords(function (err, record) {
					console.log(record);
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

	signInFacebook(fbResponse, cb, history) {
		let accessToken = fbResponse.accessToken;
		AWS.config.credentials = this._getAwsIdentityCredentials({facebook: accessToken});

		AWS.config.credentials.get((err) => {
			if (err) return console.log("Error", err);
			//@todo We should update name and email when logging in with facebook
			//Do a sync of data from CognitoSync
			let syncClient = new AWS.CognitoSyncManager();
			syncClient.openOrCreateDataset('myTestDataSet', function(err, dataset) {
				dataset.synchronize({
					onSuccess: function (data, newRecords) {
						console.log("Successufl login with facebook");
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

						//Do a sync of data from CognitoSync
						let syncClient = new AWS.CognitoSyncManager();
						syncClient.openOrCreateDataset('myTestDataSet', function(err, dataset) {
              dataset.synchronize({
                onSuccess: function (data, newRecords) {
									cb();
                },
								onError: function(error) {
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
	},

  /**
	 * Build theAwsCognitoIdentityCredentials based on alle the current logins (facebook, UserPool etc)
	 *
   * @returns {CognitoIdentityCredentials}
   * @private
   */
	_getAwsIdentityCredentials(tokens) {

		// First check if logged in to UserPool
		let logins = {};
		if (this.userHasValidSession()) {
			let cognitoKey = 'cognito-idp.' + appConfig.region + '.amazonaws.com/' + appConfig.UserPoolId;
			logins[cognitoKey] = this.getIdTokenOfCurrentUser().getJwtToken();
		}
		//@todo How do I check if already logged in to facebook in order to add the facebook token. For now we rely on the tokens being part of the call
		if (tokens && tokens.facebook) {
			logins['graph.facebook.com'] = tokens.facebook
		}

    return new AWS.CognitoIdentityCredentials({
      IdentityPoolId: appConfig.IdentityPoolId,
      Logins: logins
    });
	}
};

export default auth;