import { React, useState } from 'react';
import { Modal, Fade, makeStyles, TextField, Button} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert'
import axios from 'axios';
import UserMenu from './userMenu';

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

export default function LoginForm( {isShowed, handleLogin, handleClose} ) {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleLoginChange = (event) => setLogin(event.target.value);
    

    const handleLoginButton = () => {
        axios.post('/auth/login', { login: login,pass: password})
            .then(res => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('refresh_token', res.data.refreshToken);
                handleClose();
                handleLogin();
            })
            .catch(error => {
                setError(error.response.data.message);
            });
    }

    const handleErrorClose = () => setError('');


    return (
        <Modal open={isShowed} 
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            closeAfterTransition
            onClose={handleClose}
            className={classes.modal}>
            <Fade in={isShowed} className={classes.paper}>
                <div>
                    <TextField label="Номер телефону або email" onBlur={handleLoginChange} 
                        className={classes.input} fullWidth={true}/>
                    <TextField label="Пароль" onBlur={handlePasswordChange} type="password" className={classes.input}
                        fullWidth={true}/>
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
