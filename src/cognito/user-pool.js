import {
	AuthenticationDetails,
	CognitoUserAttribute,
	CognitoUser,
} from "amazon-cognito-identity-js";

export const signIn = (email, password, props) => {
	let authenticationData = {
		Username : email,
		Password : password,
	};
	let authenticationDetails = new AuthenticationDetails(authenticationData);

	let userPool = props.state.cognito.userPool;
	let userData = {
		Username : email,
		Pool : userPool
	};

	let cognitoUser = new CognitoUser(userData);

	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: (result) => {
			props.updateUser(cognitoUser);
			props.history.push('/dashboard');
		},

		onFailure: function(err) {
			props.updateUser(cognitoUser);
			if (err.name === 'UserNotConfirmedException') {
				props.history.push('/confirm-email');
			} else {
				alert(err);
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
			alert(err);
			return;
		}

		localStorage.setItem('cognitoUserEmail', email);
		props.history.push('/confirm-email');
	});
};

export const getCognitoUser = (state) => {
	let userPool = state.cognito.userPool;
	let currentUser = state.cognito.user;
	let email = null;

	if (currentUser) {
		email = currentUser.username;
	} else {
		email = localStorage.getItem('cognitoUserEmail') || null;
	}

	if (!email) return null;

	let userData = {
		Username: email,
		Pool: userPool
	};
	return new CognitoUser(userData);
};

export const confirmEmail = (email, confirmationCode, props) => {
	let cognitoUser = getCognitoUser(props.state);

	if (cognitoUser) {
		cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
			if (err) {
				alert(err);
				return;
			}

			props.history.push('/signin');
		});
	} else {
		props.history.push('/signin');
	}
};

export const deleteUser = (props) => {
	let cognitoUser = props.state.cognito.user;

	if (cognitoUser) {
		cognitoUser.deleteUser(function(err, result) {
			if (err) {
				alert(err);
				return;
			}

			props.history.push('/signin');
		});

	} else {
		throw new Error('No instance of cognitoUser to delete!');
	}
};