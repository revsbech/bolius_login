import {
	SET_USER
} from '../actionConstants';
import { assign } from 'lodash/assign';

// ------------------------------------
// INITIAL STATE
// ------------------------------------
export const initialState = {
	user: {}
};

// ------------------------------------
// REDUCER
// ------------------------------------
const ACTION_HANDLERS = {
	[SET_USER]: (state, action) => {
		return assign({}, state, {
			user: action.payload.user
		});
	}
};

export default function reducer (state = 0, action) {
	const handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state
};