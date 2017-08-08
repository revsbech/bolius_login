import React from "react";
import {Route} from 'react-router-dom';
import AuthRoute from '../AuthRoute';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import ConfirmEmailForm from './ConfirmEmailForm';
import Dashboard from './Dashboard';
import DeleteUser from './DeleteUser';
import ForgotPassword from './ForgotPassword';
import RefreshLogin from './RefreshLogin';
import ForgotPasswordVerification from './ForgotPasswordVerification';
import {getFailureRedirectUrl, getSuccessRedirectUrl, isHusetskalender} from "../cognito/url-helpers";

class Wrapper extends React.Component {

  constructor(props) {
    super(props);

    let state = { bodyClass: 'bolius' };

    if (isHusetskalender()) {
      state = { bodyClass: 'husetskalender' };
    }
    getSuccessRedirectUrl();
    getFailureRedirectUrl();


    this.state = state;
  }

  render() {
    return (
      <div className={this.state.bodyClass}>
        <div className="back">
          <a href="http://www.bolius.dk/">Tilbage til Bolius</a>
        </div>
        <div className="vertical-center">
          <div className="container">
            <div className="row">
              <div className="col-xs-4 offset-xs-4 col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-12">
                <div className="form-signin">
                  <span className="logo"></span>

                  <Route exact path="/" component={SignInForm} ></Route>
                  <Route path="/signup" component={SignUpForm} ></Route>
                  <Route path="/confirm-email" component={ConfirmEmailForm} ></Route>
                  <Route path="/forgot-password" component={ForgotPassword}/>
                  <Route path="/forgot-password-verification" component={ForgotPasswordVerification}/>
                  <AuthRoute path="/refresh" component={RefreshLogin}/>
                  <AuthRoute path="/dashboard" component={Dashboard}/>
                  <AuthRoute path="/delete-user" component={DeleteUser}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Wrapper;