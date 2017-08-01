import React from "react";
import { deleteUser } from '../cognito/user-pool';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../Redux/actions';

class DeleteUser extends React.Component {
	handleSubmit(e) {
		e.preventDefault();
		deleteUser(this.props);
	}

	render() {
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)}>
					<h2 className="form-signin-heading">Delete user</h2>
					<p>Are you sure you want to delete your user?</p>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Yes, delete"/>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({state});

const mapDispatchToProps = (dispatch) => bindActionCreators({ logout }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeleteUser);
