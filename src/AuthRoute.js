import React from 'react';
import {Route, Redirect, withRouter} from 'react-router-dom';
import auth from './Authentication';
import {connect} from 'react-redux';

const AuthRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		auth.userHasValidIdentitySession({props, ...rest}) ? (
			<Component {...props}/>
		) : (
			<Redirect to={{
				pathname: '/signin',
				state: { from: props.location }
			}}/>
		)
	)}/>
);

const mapStateToProps = (state) => ({state});

export default withRouter(connect(mapStateToProps)(AuthRoute));
