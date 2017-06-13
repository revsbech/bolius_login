import React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'
import AuthRoute from './AuthRoute';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import ConfirmEmailForm from './components/ConfirmEmailForm';
import Dashboard from './components/Dashboard';
import Frontpage from './components/Frontpage';
import DeleteUser from './components/DeleteUser';
import {connect} from 'react-redux';


const AppRouter = ({ history }) => (
	<ConnectedRouter history={history}>
		<div>
			<Route exact path="/" component={Frontpage} ></Route>
			<Route path="/signin" component={SignInForm} ></Route>
			<Route path="/signup" component={SignUpForm} ></Route>
			<Route path="/confirm-email" component={ConfirmEmailForm} ></Route>
			<AuthRoute path="/dashboard" component={Dashboard}/>
			<AuthRoute path="/delete-user" component={DeleteUser}/>
		</div>
	</ConnectedRouter>
);


const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(AppRouter);
