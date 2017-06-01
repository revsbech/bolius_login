import React from "react";
import { Link } from 'react-router-dom';
import auth from '../Authentication';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { increment, decrement } from '../Redux/actions';

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
				</form>
				<div>{this.props.state.counter}</div>
				<button onClick={this.props.increment}>+</button>
				<button onClick={this.props.decrement}>-</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({state});

const mapDispatchToProps = (dispatch) => bindActionCreators({increment, decrement}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);