import React from "react";
import { connect } from 'react-redux';
import { signUp } from '../cognito/user-pool';

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.getItem('cognitoUserEmail') || '',
      password: '',
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

    signUp(email, password, this.props);
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
                    Opret en Bolius-profil
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
                  <button type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn">Registrer</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(SignUpForm);
