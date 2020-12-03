import jwt_decode from 'jwt-decode';
import { LOGIN_SUCCESS, LOGOUT } from '../actions/type';

export function successLogin(token) {
    const user = jwt_decode(token);
    return {
        type: LOGIN_SUCCESS,
        payload:  {user: user, isLoggedIn: true}
    };
}

export function logout() {
    return {
        type: LOGOUT,
    }
}
