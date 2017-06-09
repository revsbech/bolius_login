import React from "react";
import TokenViewer from './TokenViewer';
import { Link } from 'react-router-dom';
import appConfig from '../config';
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, updateCredentials } from '../Redux/actions';
import { signOut, getCredentials } from '../cognito/auth-helpers';
import { getOpenIdTokenForCurrentUser,  } from '../cognito/utils';

class Dashboard extends React.Component {

	constructor() {
		super();
		this.state = {
			userDetails: {},
			openIdToken: ""
		};
	}

	handleSubmit(e) {
		e.preventDefault();
		signOut(this.props);
	}

	handleCreateIdentity(e) {
		e.preventDefault();
		console.log("Fetching id");
		getOpenIdTokenForCurrentUser(this.props).then((token) => {
			console.log(token);
			this.setState({openIdToken: token});
		});
	}

	responseFacebook(response) {
		//Make sure the access token is set, since we use that when determine which logins to use when calling AWS
		localStorage.setItem('facebookAccessToken', response.accessToken);

		let creds = getCredentials(this.props.state, appConfig);

		creds.getPromise().then(() => {

			// Update credentials in the store
			this.props.updateCredentials(creds);

			alert('Connected!');
		}, err => {
			console.log('err', err);
		});
	}

	render() {
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
					<h2 className="form-signin-heading">Hep {this.state.userDetails.name}, you are perfectly signed in
						:)</h2>
					<p><a target="blank"
						  href={'http://localhost/index.php?id=37&logintype=login&cognito_id_token=' + this.state.openIdToken}>Login
						to bolius (Test-link)</a></p>
					<Link to="/delete-user">Delete user?</Link>
					<p><a href="#" onClick={this.handleCreateIdentity.bind(this)}>Fetch OpenID Token for further
						validation</a></p>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Sign out"/>
					<hr />
					<FacebookLogin
						appId="294138207713667"
						autoLoad={false}
						fields="name,email,picture"
						callback={this.responseFacebook.bind(this)}
						textButton="Tilknyt facebook"
					/>
					<TokenViewer token={this.state.openIdToken}/>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({state});

const mapDispatchToProps = (dispatch) => bindActionCreators({ logout, updateCredentials }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

