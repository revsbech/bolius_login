import React from 'react';
import {Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { userHasValidIdentitySession } from './cognito/helpers';

const AuthRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		userHasValidIdentitySession({props, ...rest}) ? (
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
