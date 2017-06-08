import {
	SET_USER
} from '../actionConstants';

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
		return Object.assign({}, state, {
			user: action.payload.user
		});
	}
};

export default function reducer (state = 0, action) {
	const handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state
};