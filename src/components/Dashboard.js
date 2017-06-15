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
			<div className="vertical-center">
				<div className="container">
					<div className="row">
						<div className="col-xs-4 offset-xs-4 col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-12">
							<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
								<h2 className="form-signin-heading">Bolius login - Logget ind</h2>
								<p>Du er logget ind i bolius universet med brugernavn <strong>@todo</strong>. Vælg om du vil videre til</p>

			<ul>
			  <li>Mit bolius (bolius.dk)</li>
			  <li>Husets kalender</li>
			</ul>


								<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Log ud"/>
								<hr />
								<h5>Andre loginmuligheder</h5>
								<p>Hvis du heller vil kunne logge ind med facebook, Google+ eller andet, så tilknyt dit loginer her.</p>
								<div className="social-login">
									<FacebookLogin
										appId="294138207713667"
										cssClass="facebook"
										autoLoad={false}
										fields="name,email,picture"
										callback={this.responseFacebook.bind(this)}
										textButton=""
										tag="a"
									/>
								</div>
											<hr />
								<h5>Debug</h5>
								<p>
									<a href="#" onClick={this.handleCreateIdentity.bind(this)}>Fetch OpenID Token for further validation</a>
								</p>
								<TokenViewer token={this.state.openIdToken}/>
							</form>
						</div>
			 	  </div>
			  </div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({state});

const mapDispatchToProps = (dispatch) => bindActionCreators({ logout, updateCredentials }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

