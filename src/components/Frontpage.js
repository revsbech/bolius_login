import React from "react";

class Frontpage extends React.Component {
	handleSubmit(e) {
		e.preventDefault();
		this.props.history.push('/signin');
	}

	render() {
		return (
			<div>
				<div className="back">
					<a href="http://www.bolius.dk/">Tilbage til Bolius</a>
				</div>
				<div className="vertical-center">
					<div className="container">
						<div className="row">
							<div className="col-xs-4 offset-xs-4 col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-12">
								<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
									<span className="logo"></span>
									<p className="text-center">
										Bolius login
									</p>
									<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Sign in"/>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Frontpage;