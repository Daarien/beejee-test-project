import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import * as account from './account';
import * as tasks from './tasks';

export { account, tasks };

const reducers = {
	account: account.reducer,
	tasks: tasks.reducer,
};

export default () => createStore(
	combineReducers(reducers),
	applyMiddleware(thunk)
);