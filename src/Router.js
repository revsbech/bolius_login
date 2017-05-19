import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

const AppRouter = () => (
	<Router>
		<di>
			<Route exact path="/" component={SignInForm} ></Route>
			<Route path="/register" component={SignUpForm} ></Route>
		</di>
	</Router>
);

export default AppRouter;

