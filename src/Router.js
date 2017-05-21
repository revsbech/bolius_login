import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';

const AppRouter = () => (
	<Router>
		<di>
			<Route path="/signin" component={SignInForm} ></Route>
			<Route path="/signup" component={SignUpForm} ></Route>
		</di>
	</Router>
);

export default AppRouter;

