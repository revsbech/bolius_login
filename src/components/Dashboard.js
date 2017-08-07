import React from "react";
import TokenViewer from './TokenViewer';
//import { Link } from 'react-router-dom';
import appConfig from '../config';
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, updateCredentials } from '../Redux/actions';
import { signOut, getCredentials } from '../cognito/auth-helpers';
import { getOpenIdTokenForCurrentUser,  } from '../cognito/utils';
import BoliusApi from '../boliusapi';
import swal from "sweetalert2";
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

	componentDidMount() {
		this.fetchCurrentUserAndToken();
  }
  fetchCurrentUserAndToken() {
		getOpenIdTokenForCurrentUser(this.props).then((token) => {
			this.setState({openIdToken: token});
			BoliusApi.getUser(token).then((userData) => {
				this.setState({userDetails: userData.data.attributes});
			}).catch(err => {
				swal({
					type: 'error',
					title: ' Fejl',
					text: "Der opstod en fejl i kommunikationen med api.bolius.dk"
				});
			});
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
			<form onSubmit={this.handleSubmit.bind(this)}>
				<h2 className="form-signin-heading">Bolius login - Logget ind</h2>
				<p>Du er logget ind i bolius universet med brugernavn <strong>{this.state.userDetails.name}</strong>. Vælg om du vil videre til</p>

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
				<TokenViewer token={this.state.openIdToken}/>
			</form>
		);
	}
}

const mapStateToProps = (state) => ({state});

const mapDispatchToProps = (dispatch) => bindActionCreators({ logout, updateCredentials }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

