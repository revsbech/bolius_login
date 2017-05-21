import React from "react";

class Frontpage extends React.Component {
	handleSubmit(e) {
		e.preventDefault();
		this.props.history.push('/signin');
	}

	render() {
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
					<h2 className="form-signin-heading">Frontpage of the app.</h2>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Sign in"/>
				</form>
			</div>
		);
	}
}

export default Frontpage;