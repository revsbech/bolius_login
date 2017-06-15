import React from "react";

class TokenViewer extends React.Component {

  render() {
    return (
      <div>Token viewer: <textarea className="token-selector" value={this.props.token}/></div>
    );
  }
}

export default TokenViewer;