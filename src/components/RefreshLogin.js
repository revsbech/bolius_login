import React from "react";
import TokenViewer from './TokenViewer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOpenIdTokenForCurrentUser,  } from '../cognito/utils';


class RefreshLogin extends React.Component {

  constructor() {
 		super();
 		this.state = {
 			openIdToken: ""
 		};
 	}

  componentWillMount() {
    const queryString = require('query-string');
    const parsed = queryString.parse(this.props.location.search,"Parsed query Params");

    getOpenIdTokenForCurrentUser(this.props).then((token) => {
      this.setState({openIdToken: token});
      if (token) {

        if (parsed.redirect_url) {
          const url = parsed.redirect_url + '?jwt=' + token;
          window.location= url;
        }
      }

    });
  }

  render() {
    return (
      <div>
        <h2>Token refresh</h2>
        <hr />
        <TokenViewer token={this.state.openIdToken}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({state});
const mapDispatchToProps = (dispatch) => bindActionCreators({  }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(RefreshLogin);
