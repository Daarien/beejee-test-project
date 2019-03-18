const SET_USER = 'account/SET_USER';
const CLEAR_USER = 'account/CLEAR_USER';

export const dispatcher = {
	logIn: (userInfo) => dispatch => {
		dispatch({ type: SET_USER, userInfo });
	},
	logOff: () => dispatch => {
		dispatch({ type: CLEAR_USER });
	}
}

const initialState = {
	name: 'User',
	status: 'guest',
	users: [
		{ name: 'Admin', status: 'admin', login: 'admin', password: '123' }
	],
}

export function reducer(state = initialState, action) {
	if (action.type === SET_USER) {
		return {
			...state,
			name: action.userInfo.name,
			status: action.userInfo.status,
		};
	}
	if (action.type === CLEAR_USER) {
		return initialState;
	}

	return state;
}