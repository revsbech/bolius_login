import React from "react";
import auth from '../Authentication';

class DeleteUser extends React.Component {
	handleSubmit(e) {
		e.preventDefault();
		auth.deleteUser(() => this.props.history.push('/signin'));
	}

	render() {
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
					<h2 className="form-signin-heading">Delete user</h2>
					<p>Are you sure you want to delete your user?</p>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Yes, delete"/>
				</form>
			</div>
		);
	}
}

export default DeleteUser;