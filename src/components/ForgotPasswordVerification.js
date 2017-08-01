import React from "react";
import { forgotPasswordVerification } from '../cognito/user-pool';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUser } from '../Redux/actions';

class ForgotPasswordVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.getItem('cognitoUserEmail') ? localStorage.getItem('cognitoUserEmail') : '',
      verificationCode: '',
      password: ''
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    forgotPasswordVerification(this.state.verificationCode, this.state.email, this.state.password, this.props);
  }

  handleVerificationCodeChange(e) {
    this.setState({verificationCode: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <p className="text-center">Indtast koden du har modtaget på email og en ny adgangskode.</p>
        <div className="form-group">
          <input type="text"
                 className="form-control"
                 value={this.state.verificationCode}
                 placeholder="Verification code"
                 onChange={this.handleVerificationCodeChange.bind(this)}/>
        </div>
        <hr/>
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
        <input type="submit" className="btn btn-lg btn-primary btn-block sign-in-btn" value="Gem ændringer"/>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({state});

const mapDispatchToProps = (dispatch) => bindActionCreators({ forgotPasswordVerification, updateUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordVerification);
