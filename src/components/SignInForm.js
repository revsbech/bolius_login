import React from "react";
import { Link } from 'react-router-dom';
import auth from '../Authentication';
import FacebookLogin from 'react-facebook-login';


class SignInForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: localStorage.getItem('cognitoUserEmail') || '',
			password: ''
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

		localStorage.setItem('cognitoUserEmail', email);
		auth.signIn(email, password, () => this.props.history.push('/dashboard'), this.props.history);
	}

	handleFacebookLogin(response) {
		if (!response.accessToken ) {
			return;
		}

		console.log("You are.."  + response.accessToken);
		auth.signInFacebook(response.accessToken,  () => this.props.history.push('/dashboard'), this.props.history);

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
					<Link to="/signup">Register new user?</Link>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn"/>
				<hr />
				<FacebookLogin
						appId="294138207713667"
						autoLoad={false}
						fields="name,email,picture"
						callback={this.handleFacebookLogin.bind(this)}
						textButton="Login med facebook"
						/>

				</form>
			</div>
		);
	}
}

export default SignInForm;