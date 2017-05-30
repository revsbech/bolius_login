import React from "react";
import { Link } from 'react-router-dom';
import auth from '../Authentication';
import {config, CognitoIdentityCredentials} from "aws-sdk";
import FacebookLogin from 'react-facebook-login';

class Dashboard extends React.Component {

	handleSubmit(e) {
		e.preventDefault();
		auth.signOut(() => this.props.history.push('/signin') );
	}

	handleCreateIdentity(e) {
		e.preventDefault();

		config.region = "eu-central-1";
		var jwtToken = auth.getIdTokenOfCurrentUser().getJwtToken();
		config.credentials = new CognitoIdentityCredentials({
			IdentityPoolId: 'eu-central-1:623e48e1-a865-4a64-b0e1-75c9faac18bb',
			Logins: {
				'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_gD9Sc0iLZ': jwtToken
			}
    });

		config.credentials.get(function(err) {
			if (err) return console.log("Error", err);
			alert("Your Cognito Identity ID is " + config.credentials.identityId)
		});
	}

	handleFacebookClick() {
		//console.log("handle clicked");
		//@todo Do we need to hook in here?
	}

	responseFacebook(response) {

		//console.log("facebook resp");
		//console.log(response);

		config.region = "eu-central-1";
		var jwtToken = auth.getIdTokenOfCurrentUser().getJwtToken();

		//@todo Shoudl probably be moved somewhere else, and at least read the IdentityPoolId and userPoolId
		config.credentials = new CognitoIdentityCredentials({
			IdentityPoolId: 'eu-central-1:623e48e1-a865-4a64-b0e1-75c9faac18bb',
			Logins: {
				'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_gD9Sc0iLZ': jwtToken,
				'graph.facebook.com': response.accessToken,
			}
    });

		config.credentials.get(function(err) {
			if (err) return console.log("Error", err);
			alert("Facebook login: Your Cognito Identity ID is " + config.credentials.identityId)
		});
		/**/

	}
	render() {
		const token = auth.getIdTokenOfCurrentUser().getJwtToken();
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
					<h2 className="form-signin-heading">Hep, you are perfectly signed in :)</h2>
			<p><a target="blank" href={'http://localhost/index.php?id=37&logintype=login&cognito_id_token=' + token}>Login to bolius (Test-link)</a></p>
					<Link to="/delete-user">Delete user?</Link>
					<p><a href="#" onClick={this.handleCreateIdentity.bind(this)}>Cognito Identity pool id</a></p>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Sign out"/>
			<hr />
			<p>Facebook goes here</p>
		<FacebookLogin
		    appId="294138207713667"
		    autoLoad={false}
		    fields="name,email,picture"
		    onClick={this.handleFacebookClick}
		    callback={this.responseFacebook}
				textButton="Tilknyt facebook"
		    />
				</form>
			</div>
		);
	}
}

export default Dashboard;