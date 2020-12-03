import { combineReducers } from 'redux'
import { authReducer } from './auth';
import { loginFormReducer } from './loginForm';


export const rootReducer = combineReducers({
    user: authReducer,
    loginForm: loginFormReducer
});