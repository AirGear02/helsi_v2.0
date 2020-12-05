import authorize from '../utils/auth';
import jwt_decode from 'jwt-decode';
import {LOGIN_SUCCESS, LOGOUT} from '../actions/type';


const initialState = authorize()
    ? { isLoggedIn: true, user: jwt_decode(localStorage.getItem('token')) }
    : { isLogged: false, user: null };

export function authReducer (state = initialState, action) {
    switch(action.type){
        case LOGIN_SUCCESS: 
            return {...state, ...action.payload};

        case LOGOUT:
            return {...state, isLoggedIn: false, user: null}
        
        default: return state;

    }
} 