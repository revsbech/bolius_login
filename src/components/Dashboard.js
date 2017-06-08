import React from "react";
import TokenViewer from './TokenViewer';
import { Link } from 'react-router-dom';
import auth from '../Authentication';
import FacebookLogin from 'react-facebook-login';
import {connect} from 'react-redux';


class Dashboard extends React.Component {

	constructor() {
    super();
    this.state = {
    	userDetails: {},
			openIdToken: ""
    };

		auth.getSyncedData((user) => {
			this.setState({userDetails: user});
		});
		/**/

  }
	handleSubmit(e) {
		e.preventDefault();
		auth.signOut(() => this.props.history.push('/signin') );
	}

	handleCreateIdentity(e) {
		e.preventDefault();
		console.log("Fetching id");
		auth.getOpenIdTokenForCurrentUser().then((token) => {
			console.log(token);
			this.setState({openIdToken: token});
		});
	}

	responseFacebook(response) {
		//Make sure the access token is set, since we use that when determine which logins to use when calling AWS

		localStorage.setItem('facebookAccessToken', response.accessToken);
		auth.callGetIdentity().then(() => {
			alert("Connected!!!");
		})

	}
	render() {
		return (
			<div className="wrapper">
				<form onSubmit={this.handleSubmit.bind(this)} className="form-signin">
					<h2 className="form-signin-heading">Hep {this.state.userDetails.name}, you are perfectly signed in :)</h2>
			<p><a target="blank" href={'http://localhost/index.php?id=37&logintype=login&cognito_id_token=' + this.state.openIdToken}>Login to bolius (Test-link)</a></p>
					<Link to="/delete-user">Delete user?</Link>
			<p><a href="#" onClick={this.handleCreateIdentity.bind(this)} >Fetch OpenID Token for further validation</a></p>
					<input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Sign out"/>
			<hr />
		<FacebookLogin
		    appId="294138207713667"
		    autoLoad={false}
		    fields="name,email,picture"
		    callback={this.responseFacebook}
				textButton="Tilknyt facebook"
		    />
					<TokenViewer token={this.state.openIdToken} />
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(Dashboard);

