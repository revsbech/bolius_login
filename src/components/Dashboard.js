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
import {BoliusApi} from '../boliusapi';
import swal from "sweetalert2";

class Dashboard extends React.Component {

	constructor() {
		super();
		this.state = {
			userDetails: {
				fistName: "ukendt"
			},
			openIdToken: ""
		};
	}

	handleSubmit(e) {
		e.preventDefault();
		signOut(this.props);
	}
  componentWillMount() {
		//If a redirect_url is stored in the localStorage. Should probably be added to the Redux state instead...
		const redirect_url = localStorage.getItem('redirect_url');
		if (redirect_url) {
			getOpenIdTokenForCurrentUser(this.props).then((token) => {
        this.setState({openIdToken: token});
        if (token) {
					localStorage.removeItem('redirect_url');
					const url = redirect_url + '?jwt=' + token;
					window.location = url;
				}
			})
   	}
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

				if (err.type === 404) {
					//Create user in API
					console.log("Create user in API");
					const userData = {
						"firstName": "Test",
						"lastName":  "Tester",
						"email": "email@example.com"
					};
					BoliusApi.createUser(token, userData).then(() => {
						swal({
							type: 'info',
							title: ' Bruger oprettet',
							text: "Der er oprettet en bruger til dig."
						});
						//Call again to make sure it loads correctly
						BoliusApi.getUser(token).then((userData) => {
										this.setState({userDetails: userData.data.attributes});
						});
          }).catch(err => {
						swal({
							type: 'error',
							title: ' Fejl : ' + err.id,
							text: err.message
						});
					});
        } else {
          swal({
            type: 'error',
            title: ' Fejl : ' + err.id,
            text: err.message
          });
        }
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
		}, err => {
			swal({
				type: 'error',
				title: ' Fejl',
				text: err
			});

		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit.bind(this)}>
				<h2 className="form-signin-heading">Bolius login - Logget ind</h2>
				<p>Du er logget ind i bolius universet som  <strong>{this.state.userDetails.firstName} {this.state.userDetails.lastName}</strong>. Vælg om du vil videre til</p>

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

