import jwt_decode from 'jwt-decode';
import axios from 'axios';

axios.defaults.baseURL = "https://helsi-289508.nw.r.appspot.com/api/v1";


const checkIsTokenExpired = token => {
    try {
        const decoded = jwt_decode(token);
        return decoded.exp * 1000 <= Date.now();
    }
    catch (ex) {
        return true;
    }
}


export default function authorize() {

    const token = localStorage.getItem('token');

    if (token === null) return false;
    if (!checkIsTokenExpired(token)) return true;

    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken === null || checkIsTokenExpired(refreshToken)) return false;

    return axios.post('/auth/refreshToken', {
        refreshToken: refreshToken
    }, { headers: { Authorization: 'Bearer ' + refreshToken } })
        .then(res => {
            localStorage.setItem('token', res.data.token);
            return true;
        })
        .catch(error => false)
}


