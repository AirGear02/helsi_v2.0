import { OPEN_FORM, CLOSE_FORM } from '../actions/type';

export function openForm(token) {
    return {
        type: OPEN_FORM,
        payload: { isShowed: true }
    };
}

export function closeForm() {
    return {
        type: CLOSE_FORM,
        payload: { isShowed: false }
    }
}
