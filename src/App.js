import './App.css';
import {Config, CognitoIdentityCredentials} from "aws-sdk";
import {
	CognitoUserPool,
	CognitoUserAttribute
} from "amazon-cognito-identity-js";
import React from "react";
import ReactDOM from "react-dom";
import appConfig from "./config";

Config.region = appConfig.region;
Config.credentials = new CognitoIdentityCredentials({
	IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
	UserPoolId: appConfig.UserPoolId,
	ClientId: appConfig.ClientId,
});

class SignUpForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
	}

	handleEmailChange(e) {
		this.setState({email: e.target.value});
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	handleSubmit(e) {
		e.preventDefault();
		const email = this.state.email.trim();
		const password = this.state.password.trim();
		const attributeList = [
			new CognitoUserAttribute({
				Name: 'email',
				Value: email,
			})
		];
		userPool.signUp(email, password, attributeList, null, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log('user name is ' + result.user.getUsername());
			console.log('call result: ' + result);
		});
	}

	render() {
		return (
		    <div className="wrapper">
                <form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
                    <h2 className="form-signin-heading">Please Sign up</h2>
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
                    <input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn"/>
                </form>
            </div>
		);
	}
}

ReactDOM.render(<SignUpForm />, document.getElementById('root'));


export default SignUpForm;
