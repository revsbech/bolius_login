import {
	AuthenticationDetails,
	CognitoUserPool,
	CognitoUser
} from "amazon-cognito-identity-js";
import React from "react";
import appConfig from "./config";
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode'

class SignInForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
		this.state.currentUser = {};
	}

	handleEmailChange(e) {
		this.setState({email: e.target.value});
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	logout() {
		console.log('this.state.currentUser', this.state.currentUser);
		this.state.currentUser.signOut();
	}

	handleSubmit(e) {
		let component = this;
		e.preventDefault();
		const email = this.state.email.trim();
		const password = this.state.password.trim();

		let authenticationData = {
			Username : email,
			Password : password,
		};
		let authenticationDetails = new AuthenticationDetails(authenticationData);
		const poolData = {
			UserPoolId: appConfig.UserPoolId,
			ClientId: appConfig.ClientId,
		};
		let userPool = new CognitoUserPool(poolData);
		let userData = {
			Username : email,
			Pool : userPool
		};
		let cognitoUser = new CognitoUser(userData);

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				console.log('access token + ' + result.getAccessToken().getJwtToken());
				console.log('cognitoUser', cognitoUser);
				component.setState({currentUser: cognitoUser});
				console.log('token decoded', jwtDecode(result.getAccessToken().getJwtToken()));
				console.log('token expiration', result.getAccessToken().getExpiration());


				// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
				// 	IdentityPoolId : '...', // your identity pool id here
				// 	Logins : {
				// 		// Change the key below according to the specific region your user pool is in.
				// 		'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>' : result.getIdToken().getJwtToken()
				// 	}
				// });

				// Instantiate aws sdk service objects now that the credentials have been updated.
				// example: var s3 = new AWS.S3();

			},

			onFailure: function(err) {
				alert(err);
			},

		});

	}

	render() {
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
					<h2 className="form-signin-heading">Sign in</h2>
					<input type="text"
						   className="form-control"
						   value={this.state.email}
						   placeholder="Email"
						   onChange={this.handleEmailChange.bind(this)}/>
					<input type="password"
						   className="form-control"
						   value={this.state.password}
						   placeholder="Password"
						   onChange={this.handlePasswordChange.bind(this)}/>
					<Link to="/register">Register new user?</Link>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn"/>
				</form>
				<button onClick={this.logout.bind(this)}>Logout</button>
			</div>
		);
	}
}

export default SignInForm;