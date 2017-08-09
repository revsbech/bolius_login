import appConfig from '../config';
import AWS from "aws-sdk";
import { CognitoAccessToken, CognitoIdToken,CognitoRefreshToken,CognitoUserSession } from 'amazon-cognito-identity-js';

/**
 * This is a ripof of the part from CogntioUser.getSession that only returns the cached part.
 *
 * It should proably be made as a prototype in order to use the this.store, but for now this is just copied.
 * @param userPool
 */
const getCachedSession = userPool => {
  let cognitoUser = userPool.getCurrentUser();
  var keyPrefix = 'CognitoIdentityServiceProvider.' + userPool.getClientId() + '.' + cognitoUser.username;
  var idTokenKey = keyPrefix + '.idToken';
  var accessTokenKey = keyPrefix + '.accessToken';
  var refreshTokenKey = keyPrefix + '.refreshToken';

  if (localStorage.getItem(idTokenKey)) {

    var idToken = new CognitoIdToken({
      IdToken: localStorage.getItem(idTokenKey)
    });
    var accessToken = new CognitoAccessToken({
      AccessToken: localStorage.getItem(accessTokenKey)
    });
    var refreshToken = new CognitoRefreshToken({
      RefreshToken: localStorage.getItem(refreshTokenKey)
    });

    var sessionData = {
      IdToken: idToken,
      AccessToken: accessToken,
      RefreshToken: refreshToken
    };
    return new CognitoUserSession(sessionData);
  } else {
    return;
  }

};


/**
 *
 * Currently this does not refresh the session!
 *
 * @param userPool
 * @returns {boolean}
 */
export const userHasValidUserpoolSession = userPool => {
  const session = getCachedSession(userPool);
  if (!session) {
    return false;
  } else {
    return session.isValid()
  }

  /*
  let cognitoUser = userPool.getCurrentUser();

  if (!cognitoUser) return false;

  return cognitoUser.getSession((err, session) => {
    if (!session) {
      //throw(err); // have your route handler toss user back to login route
      return false
    }

    return session.isValid();
  });
  */
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

export const getIdTokenOfCurrentUserFromCache = userPool => {
  let cognitoUser = userPool.getCurrentUser();

  if (!cognitoUser) return false;
  const session = getCachedSession(userPool);
  if (!session) return false;
  if (!session.isValid()) return false;

  return session.getIdToken();

};

/**
 *
 * @param state
 * @returns {{}} - Object with current login tokens
 */
export const getLoginsFromLocallyStoredAccessTokens = (state, appConfig) => {
  let logins = {};

  // Here we only check the validity of the local cachedtoken. the normal call to getSession would possibly do a
  // re-auth and can only be don async.
  const idToken = getIdTokenOfCurrentUserFromCache(state.cognito.userPool);
  if (idToken) {
    let cognitoKey = 'cognito-idp.' + appConfig.region + '.amazonaws.com/' + appConfig.UserPoolId;
    logins[cognitoKey] = idToken.getJwtToken();
  }

  // Facebook login
  let facebookAccessToken = localStorage.getItem('facebookAccessToken');
  if (facebookAccessToken && facebookAccessToken !== "null") {
    logins['graph.facebook.com'] = facebookAccessToken;
  }

  // Twitter login
  let twitterAccessToken = localStorage.getItem('twitterAccessToken');
  if (twitterAccessToken && twitterAccessToken !== "null") {
    logins['api.twitter.com'] = twitterAccessToken;
  }

  // Google login
  let googleAccessToken = localStorage.getItem('googleAccessToken');
  if (googleAccessToken && googleAccessToken !== "null") {
    logins['accounts.google.com'] = googleAccessToken;
  }

  // Linkedin login
  let linkedinAccessToken = localStorage.getItem('linkedinAccessToken');
  if (linkedinAccessToken && linkedinAccessToken !== "null") {
    logins['linkedin.com'] = linkedinAccessToken;
  }
  return logins;
};


export const getOpenIdTokenForCurrentUser = (props) => {
  let id = props.state.cognito.credentials.identityId;
  let params = {
    IdentityId: id,
    Logins: getLoginsFromLocallyStoredAccessTokens(props.state, appConfig)
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
};


