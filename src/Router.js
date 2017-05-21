import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import AuthRoute from './AuthRoute';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import ConfirmEmailForm from './components/ConfirmEmailForm';
import Dashboard from './components/Dashboard';
import Frontpage from './components/Frontpage';
import DeleteUser from './components/DeleteUser';

const AppRouter = () => (
	<Router>
		<di>
			<Route exact path="/" component={Frontpage} ></Route>
			<Route path="/signin" component={SignInForm} ></Route>
			<Route path="/signup" component={SignUpForm} ></Route>
			<Route path="/confirm-email" component={ConfirmEmailForm} ></Route>
			<AuthRoute path="/dashboard" component={Dashboard}/>
			<AuthRoute path="/delete-user" component={DeleteUser}/>
		</di>
	</Router>
);

export default AppRouter;

