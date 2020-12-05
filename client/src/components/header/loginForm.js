import { React, useState } from 'react';
import { Modal, Fade, makeStyles, TextField, Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { successLogin } from '../../actions/auth';
import { closeForm } from '../../actions/loginForm';


axios.defaults.baseURL = "http://localhost:5000";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: '#E9F1F3',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(0, 5, 0),
        width: '20%',
        outline: 'none',
        borderRadius: '30px'
    },
    input: {
        display: 'block',
        width: '100%',
        margin: '40px 0'
    },
    button: {
        display: 'block',
        margin: '20px auto',
        color: '#009899',
        borderColor: '#009899'
    }
}));

export default function LoginForm() {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');
    const [error, setError] = useState('');
    const isShowed = useSelector(store => store.loginForm);
    const dispatch = useDispatch();

    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleLoginChange = (event) => setLogin(event.target.value);


    const handleClose = () => {
        dispatch(closeForm());
    }
    const handleLoginButton = () => {
        axios.post('/auth/login', { login: login, pass: password })
            .then(res => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('refresh_token', res.data.refreshToken);
                dispatch(closeForm());
                dispatch(successLogin(res.data.token));
            })
            .catch(error => {
                if(error.response)
                setError(error.response.data.message);
            });
    }

    const handleErrorClose = () => setError('');


    return (
        <Modal open={isShowed.isShowed}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            closeAfterTransition
            onClose={handleClose}
            className={classes.modal}>
            <Fade in={isShowed.isShowed} className={classes.paper}>
                <div>
                    <TextField label="Номер телефону або email" onBlur={handleLoginChange}
                        className={classes.input} fullWidth={true} />
                    <TextField label="Пароль" onBlur={handlePasswordChange} type="password" className={classes.input}
                        fullWidth={true} />
                    <Button variant="outlined" className={classes.button}
                        onClick={handleLoginButton}>Увійти</Button>
                    <Snackbar open={error.length !== 0} onClose={handleErrorClose}>
                        <Alert severity="error">{error}</Alert>
                    </Snackbar>
                </div>
            </Fade>

        </Modal>
    );
}
