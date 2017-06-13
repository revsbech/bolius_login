import React from "react";
import './App.css';
import AppRouter from './Router';
import {connect} from 'react-redux';
import Loader from './components/Loader';


class App extends React.Component {
	render() {
		return (
				this.props.state.isAuthenticating ? (
					<Loader {...this.props}/>
				) : (
					<AppRouter history={this.props.history} />
				)
		);
	}
}

const mapStateToProps = (state) => ({state: state.cognito});

export default connect(mapStateToProps)(App);


