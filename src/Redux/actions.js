import {
	INCREMENT,
	DECREMENT,
	SET_USER
} from './actionConstants';

export function increment() {
	return {
		type: INCREMENT
	}
}

export function decrement() {
	return {
		type: DECREMENT
	}
}

export function setUser(user) {
	return {
		type: SET_USER,
		payload: {
			user
		}
	}
}