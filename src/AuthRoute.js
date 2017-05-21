import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import auth from './Authentication';

const AuthRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		auth.userHasValidSession() ? (
			<Component {...props}/>
		) : (
			<Redirect to={{
				pathname: '/signin',
				state: { from: props.location }
			}}/>
		)
	)}/>
);

export default AuthRoute;