import React from "react";
import { Link } from 'react-router-dom';
import auth from '../Authentication';
import AWS from "aws-sdk";
import FacebookLogin from 'react-facebook-login';
import {connect} from 'react-redux';

class Dashboard extends React.Component {

	constructor() {
    super();
    this.state = {userDetails: {}};
		auth.getSyncedData((user) => {
			this.setState({userDetails: user});
		});



  }
	handleSubmit(e) {
		e.preventDefault();
		auth.signOut(() => this.props.history.push('/signin') );
	}

	handleCreateIdentity(e) {

		e.preventDefault();
		console.log(AWS.config.credentials);
		/*

		auth.getSyncedData((user) => {
			this.setState({userDetails: user});
		});
		return;
		*/
	}

	responseFacebook(response) {

		//console.log("facebook resp");
		//console.log(response);

		AWS.config.region = "eu-central-1";
		var jwtToken = auth.getIdTokenOfCurrentUser().getJwtToken();

		//@todo Shoudl probably be moved somewhere else, and at least read the IdentityPoolId and userPoolId
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'eu-central-1:623e48e1-a865-4a64-b0e1-75c9faac18bb',
			Logins: {
				'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_gD9Sc0iLZ': jwtToken,
				'graph.facebook.com': response.accessToken,
			}
    });

		AWS.config.credentials.get(function(err) {
			if (err) return console.log("Error", err);
			alert("Facebook login: Your Cognito Identity ID is " + AWS.config.credentials.identityId)
		});
		/**/

	}
	render() {
		//const token = auth.getIdTokenOfCurrentUser().getJwtToken();
		const token = "xxx";
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
					<h2 className="form-signin-heading">Hep {this.state.userDetails.name}, you are perfectly signed in :)</h2>
			<p><a target="blank" href={'http://localhost/index.php?id=37&logintype=login&cognito_id_token=' + token}>Login to bolius (Test-link)</a></p>
					<Link to="/delete-user">Delete user?</Link>
			<p><a href="#" onClick={this.handleCreateIdentity} >Test</a></p>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Sign out"/>
			<hr />
		<FacebookLogin
		    appId="294138207713667"
		    autoLoad={false}
		    fields="name,email,picture"
		    callback={this.responseFacebook}
				textButton="Tilknyt facebook"
		    />
					<div>Counter state: {this.props.state.counter}</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(Dashboard);

