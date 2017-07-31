import React from "react";
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import LinkedIn from 'react-linkedin-login'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updateUser,
  updateCredentials
} from '../Redux/actions';

import {
  signIn,
  signInFacebook,
  signInTwitter,
  signInGoogle,
  signInLinkedin
} from '../cognito';


class SignInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.getItem('cognitoUserEmail') || '',
      password: ''
    };
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    localStorage.setItem('cognitoUserEmail', email);
    signIn(email, password, this.props);
  }

  handleFacebookLogin(response) {
    if (!response.accessToken ) {
      return;
    }

    signInFacebook(response,  () => {
      this.props.history.push('/dashboard');
    }, this.props.history, this.props);
  }

  handleTwitterLogin() {
    signInTwitter(() => {
      this.props.history.push('/dashboard');
    }, this.props.history, this.props);
  }

  handleGoogleLogin(response) {
    if (!response.accessToken ) {
      return;
    }

    signInGoogle(response, () => {
      this.props.history.push('/dashboard');
    }, this.props.history, this.props);
  }

  handleLinkedinLogin(response) {
    if (!response.accessToken ) {
      return;
    }

    signInLinkedin(response, () => {
      this.props.history.push('/dashboard');
    }, this.props.history, this.props);
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
                    Log ind med din Bolius-profil
                  </p>
                  <div className="form-group">
                    <input type="text"
                           className="form-control"
                           value={this.state.email}
                           placeholder="Email"
                           onChange={this.handleEmailChange.bind(this)}/>
                  </div>
                  <div className="form-group">
                    <input type="password"
                           className="form-control"
                           value={this.state.password}
                           placeholder="Password"
                           onChange={this.handlePasswordChange.bind(this)}/>
                  </div>
                  <div className="row actions">
                    <div className="col-6 text-center">
                      <Link to="/signup" className="text-uppercase">Registrer</Link>
                    </div>
                    <div className="col-6">
                      <button type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn text-uppercase">Log ind</button>
                    </div>
                  </div>

                  <hr />
                  <p className="text-center">Eller log ind med</p>
                  <div className="social-login">
                    <FacebookLogin
                      appId="294138207713667"
                      cssClass="facebook"
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={this.handleFacebookLogin.bind(this)}
                      textButton=""
                      tag="a"
                    />

                    <a href="" className="twitter"></a>
                    <GoogleLogin
                      clientId="xxx"
                      onSuccess={this.handleGoogleLogin.bind(this)}
                      onFailure={this.handleGoogleLogin.bind(this)}
                      buttonText=""
                      className="google"
                      tag="a"
                    />
                    <LinkedIn
                      clientId='xxx'
                      callback={this.handleLinkedinLogin.bind(this)}
                      className="linkedin"
                      tag="a"
                      text='' />
                  </div>

                </form>
              </div>
            </div>
            <div className="row">
              <div className="col-12 forgot-password text-center">
                <Link to="/forgot-password">Glemt adgangskode?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({state});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser, updateCredentials }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
