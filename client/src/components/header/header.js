import { React, useState } from 'react';
import { AppBar, Typography, makeStyles, Button, List, ListItem } from '@material-ui/core';
import LoginForm  from './loginForm';
import authorize from '../../utils/auth';
import UserMenu from './userMenu';

import {Link} from 'react-router-dom';

const useStyles = makeStyles({
    header: {
        backgroundColor: '#009899',
        height: '10vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10vh',
        borderRadius: '0 0 70px 70px',

    },

    title: {
        textDecoration: 'none',
        width: 'fit-content',
        lineHeight: '100%',
    },

    loginButton: {
        width: 'fit-content',
        height: '50%',
        color: 'white',
        borderColor: 'white',
        '&:hover': {
            color: '#009899',
            backgroundColor: 'white',
            fontWeight: 'bolder'
        }
    },
    list: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: '3vh'
    },

    listItem: {
        width: 'fit-content',
        textDecoration: 'none',
        color: 'white',
        fontSize: 'medium'
    },
    nav: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }

});

export default function Header() {
    
    const [isLoginShowed, setIsLoginShowed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(authorize());
    const classes = useStyles();

    const handleLogin = () =>  {
        setIsLoginShowed(true)
    }

    const handleLogingIn = () => setIsLoggedIn(true);

    const handleClose = () => {
        setIsLoginShowed(false);
    }

    const handleLogout = () => setIsLoggedIn(false);

    const renderUserMenu =  () => {
        if(isLoggedIn) return <UserMenu handleLogoutMenu = {handleLogout}/>;
        return  <Button className={classes.loginButton} variant='outlined' color="primary" onClick={handleLogin}>Увійти</Button>;
    }
    return(
        <AppBar position='static' className={classes.header}>
            <Typography  variant='h6' className={classes.title} component={Link} to='/' color='inherit' textDecoration='inherit'>
                H E L S I
            </Typography>
            <nav className={classes.nav}>
                <List className={classes.list}>
                    <ListItem component={Link} to='/' className={classes.listItem}
                        color='inherit' textDecoration='inherit'>
                        Пошук доктора
                    </ListItem>
                    <ListItem component={Link} to='/about' className={classes.listItem}
                        color='inherit' textDecoration='inherit'>
                        Про helsi
                    </ListItem>
                </List>

               {renderUserMenu()}
            </nav>
            <LoginForm isShowed={isLoginShowed} handleClose={handleClose} handleLogin={handleLogingIn}>

            </LoginForm>
        </AppBar>
    ) 
}