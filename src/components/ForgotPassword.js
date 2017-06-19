import React from "react";
import { forgotPassword } from '../cognito/user-pool';
import { connect } from 'react-redux';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('cognitoUserEmail', this.state.email);
    forgotPassword(this.state.email, this.props);
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
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
                  <p className="text-center">Når du har indtastet din email adresse, vil du modtage en verifikationskode til at nulstille din adgangskode med.</p>
                  <div className="form-group">
                    <input type="text"
                           className="form-control"
                           value={this.state.email}
                           placeholder="Email"
                           onChange={this.handleEmailChange.bind(this)}/>

                  </div>
                  <input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Nulstil"/>
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

export default connect(mapStateToProps)(ForgotPassword);
