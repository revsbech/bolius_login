import React from "react";
import { connect } from 'react-redux';
import { signUp } from '../cognito/user-pool';

class SignUpForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: localStorage.getItem('cognitoUserEmail') || '',
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

		signUp(email, password, this.props);
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
const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(SignUpForm);
