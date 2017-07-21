import {
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";
import swal from "sweetalert2";
import { i18n } from "../i18n";

export const signIn = (email, password, props) => {
  let authenticationData = {
    Username: email,
    Password: password,
  };
  let authenticationDetails = new AuthenticationDetails(authenticationData);

  let userPool = props.state.cognito.userPool;
  let userData = {
    Username: email,
    Pool: userPool
  };

  let cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: result => {
      props.updateUser(cognitoUser);
      props.history.push('/dashboard');
    },

    onFailure: err => {
      props.updateUser(cognitoUser);
      if (err.name === 'UserNotConfirmedException') {
        props.history.push('/confirm-email');
      } else {
        swal({
          type: 'error',
          title:' Fejl',
          text: i18n(err.code)
        });
      }
    },
  });
};


export const signUp = (email, password, props) => {
  let userPool = props.state.cognito.userPool;

  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    })
  ];
  userPool.signUp(email, password, attributeList, null, (err, result) => {
    if (err) {
      swal({
        type: 'error',
        title:' Fejl',
        text: i18n(err.code)
      });
      return;
    }

    localStorage.setItem('cognitoUserEmail', email);
    props.history.push('/confirm-email');
  });
};

export const getCognitoUser = state => {
  let currentUser = state.cognito.user;
  let email = null;

  if (currentUser) {
    email = currentUser.username;
  } else {
    email = localStorage.getItem('cognitoUserEmail') || null;
  }

  if (!email) return null;

  return new CognitoUser({
    Username: email,
    Pool: state.cognito.userPool
  });
};

export const confirmEmail = (email, confirmationCode, props) => {
  let cognitoUser = getCognitoUser(props.state);

  if (cognitoUser) {
    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        swal({
          type: 'error',
          title:' Fejl',
          text: i18n(err.code)
        });
        return;
      }

      props.history.push('/signin');
    });
  } else {
    props.history.push('/signin');
  }
};

export const deleteUser = props => {
  let cognitoUser = props.state.cognito.user;

  if (cognitoUser) {
    cognitoUser.deleteUser((err, result)  => {
      if (err) {
        swal({
          type: 'error',
          title:' Fejl',
          text: i18n(err.code)
        });
        return;
      }

      props.history.push('/signin');
    });

  } else {
    throw new Error('No instance of cognitoUser to delete!');
  }
};

export const forgotPassword = (email, props) => {
  return new CognitoUser({
    Username: email,
    Pool: props.state.cognito.userPool
  }).forgotPassword({
    onSuccess: () => { props.history.push('/forgot-password-verification') },
    onFailure: err => swal({
      type: 'error',
      title: 'Fejl',
      text: i18n(err.code)
    })
  })
};

export const forgotPasswordVerification = (verificationCode, email, password, props) => {
  return new CognitoUser({
    Username: email,
    Pool: props.state.cognito.userPool
  }).confirmPassword(verificationCode, password, {
    onSuccess: () => { signIn(email, password, props) },
    onFailure: err => {
      swal({
        type: 'error',
        title: 'Fejl',
        text: i18n(err.code)
      });
    }
  });
};