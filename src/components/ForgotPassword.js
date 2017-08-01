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
      <form onSubmit={this.handleSubmit.bind(this)}>
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
    );
  }
}

const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(ForgotPassword);
