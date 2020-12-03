import {OPEN_FORM, CLOSE_FORM} from '../actions/type';
 
const initialState = {
    isShowed: false
}

export function loginFormReducer(state = initialState, action) {
    switch (action.type) {
        case OPEN_FORM:
            return { ...state, ...action.payload };

        case CLOSE_FORM:
            return { ...state, ...action.payload}

        default: return state;
    }
}