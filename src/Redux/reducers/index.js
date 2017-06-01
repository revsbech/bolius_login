import { combineReducers } from 'redux';
import counter from './counter';
import user from './user';

const boliusLoginReducers = combineReducers({
	counter,
	user
});

export default boliusLoginReducers