import React from "react";
import { Link } from 'react-router-dom';
import auth from '../Authentication';

class Dashboard extends React.Component {
	handleSubmit(e) {
		e.preventDefault();
		auth.signOut(() => this.props.history.push('/signin') );
	}

	render() {
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
					<h2 className="form-signin-heading">Hep, you are perfectly signed in :)</h2>
					<Link to="/delete-user">Delete user?</Link>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Sign out"/>
				</form>
			</div>
		);
	}
}

export default Dashboard;