import React from 'react';
import {Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { userHasValidIdentitySession } from './cognito/auth-helpers';

const AuthRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		userHasValidIdentitySession({props, ...rest}) ? (
			<Component {...props}/>
		) : (
			<div className="vertical-center">
				<div className="container">
					<div className="text-center">
						<i className="fa fa-spinner fa-pulse fa-3x fa-fw text-white"></i>
					</div>
				</div>
			</div>
		)
	)}/>
);

const mapStateToProps = (state) => ({state});

export default withRouter(connect(mapStateToProps)(AuthRoute));
