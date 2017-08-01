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
      <form onSubmit={this.handleSubmit.bind(this)}>
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
    );
  }
}
const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(SignUpForm);
