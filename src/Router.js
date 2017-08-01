import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import {connect} from 'react-redux';
import Wrapper from "./components/Wrapper";


const AppRouter = () => (
	<Router>
		<Wrapper>

		</Wrapper>
	</Router>
);


const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(AppRouter);
