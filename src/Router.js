import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import AuthRoute from './AuthRoute';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import Dashboard from './components/Dashboard';
import DeleteUser from './components/DeleteUser';

const AppRouter = () => (
	<Router>
		<di>
			<Route path="/signin" component={SignInForm} ></Route>
			<Route path="/signup" component={SignUpForm} ></Route>
			<AuthRoute path="/dashboard" component={Dashboard}/>
			<AuthRoute path="/delete-user" component={DeleteUser}/>
		</di>
	</Router>
);

export default AppRouter;

