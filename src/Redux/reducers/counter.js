import {
	INCREMENT,
	DECREMENT
} from '../actionConstants';

// ------------------------------------
// INITIAL STATE
// ------------------------------------
export const initialState = {
	counter: 0
};

// ------------------------------------
// REDUCER
// ------------------------------------
const ACTION_HANDLERS = {
	[INCREMENT]: (state, action) => {
		return state + 1;
	},
	[DECREMENT]: (state, action) => {
		return state - 1;
	}
};

export default function reducer (state = 0, action) {
	const handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state
};