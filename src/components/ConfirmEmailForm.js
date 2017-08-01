import React from "react";
import { connect } from 'react-redux';
import { confirmEmail } from '../cognito/user-pool';

class ConfirmEmailForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: localStorage.getItem('cognitoUserEmail') || '',
			confirmationCode: ''
		};
	}

	handleConfirmationCodeChange(e) {
		this.setState({confirmationCode: e.target.value});
	}

	handleEmailChange(e) {
		this.setState({email: e.target.value});
	}

	handleSubmit(e) {
		e.preventDefault();
		const confirmationCode = this.state.confirmationCode.trim();
		const email = this.state.email.trim();

		confirmEmail(email, confirmationCode, this.props);
	}

	render() {
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)}>
					<h2 className="form-signin-heading">Confirm email</h2>
					<p>Before you can sign in you need to confirm your email address. <br/> Please check you email for a confirmation code and type both the email and the code below.</p>
					<input type="text"
						   className="form-control"
						   value={this.state.email}
						   placeholder="Email"
						   onChange={this.handleEmailChange.bind(this)}/>
					<input type="text"
						   className="form-control"
						   value={this.state.confirmationCode}
						   placeholder="Code"
						   onChange={this.handleConfirmationCodeChange.bind(this)}/>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn"/>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(ConfirmEmailForm);
