import React from "react";

class TokenViewer extends React.Component {

  render() {
    return (
      <div>Token viewer: <pre>{this.props.token}</pre></div>
    );
  }
}

export default TokenViewer;