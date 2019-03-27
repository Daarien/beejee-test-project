import { get, create, edit } from '../utils';

const SET_TASKS = 'tasks/SET_TASKS';
const ADD_TASK = 'tasks/ADD_TASK';
const EDIT_TASK = 'tasks/EDIT_TASK';
const SET_UPLOADING = 'tasks/SET_UPLOADING';
const SET_ERROR = 'tasks/SET_ERROR';
const CLEAR_ERROR = 'tasks/CLEAR_ERROR';

const getTasks = (message) => {
    const { tasks, total_task_count: count } = message;
    return { type: SET_TASKS, tasks, count: +count, pages: Math.ceil(+count / 3) };
}

export const dispatcher = {
    getTasks: (query) => async dispatch => {
        query = query ? query : '';
        const response = await get(query);

        if (response.status === 'ok') {
            dispatch(getTasks(response.message));
        } else if (response.message) {
            dispatch({ type: SET_ERROR, error: response.message });
        }
    },
    addTask: (payload) => async dispatch => {
        dispatch({ type: SET_UPLOADING });
        const response = await create(payload);

        if (response.status === 'ok') {
            dispatch({ type: ADD_TASK });
        } else if (response.message) {
            dispatch({ type: SET_ERROR, error: response.message });
        }
    },
    editTask: (id, payload) => async dispatch => {
        dispatch({ type: SET_UPLOADING });
        const response = await edit(id, payload);

        if (response.status === 'ok') {
            dispatch({ type: EDIT_TASK });
        } else if (response.message) {
            dispatch({ type: SET_ERROR, error: response.message });
        }
    },
    clearWarning: () => dispatch => {
        dispatch({ type: CLEAR_ERROR });
    }
}

const initialState = {
    tasks: [],
    count: 0,
    pages: 0,
    uploading: false,
    added: false,
    edited: false,
    error: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TASKS:
            return {
                ...state,
                tasks: action.tasks,
                count: action.count,
                pages: action.pages,
            };

        case ADD_TASK:
            return { ...state, added: true, uploading: false };

        case EDIT_TASK:
            return { ...state, edited: true, uploading: false };

        case SET_UPLOADING:
            return { ...state, added: false, edited: false, uploading: true, error: '' };

        case SET_ERROR:
            return { ...state, added: false, edited: false, uploading: false, error: action.error };

        case CLEAR_ERROR:
            return { ...state, error: '' };

        default:
            return state;
    }
}