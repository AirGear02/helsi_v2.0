import { React} from 'react';
import { AppBar, Typography, makeStyles, Button, List, ListItem } from '@material-ui/core';
import LoginForm  from './loginForm';
import UserMenu from './userMenu';
import { useSelector, useDispatch } from 'react-redux'

import {Link} from 'react-router-dom';
import { openForm } from '../../actions/loginForm';
import logo from '../../static/images/logo.png';


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
        display: 'flex',
        alignItems: 'center'
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
       
        textDecoration: 'none',
        color: 'white',
        fontSize: 'medium',
        whiteSpace: 'nowrap',
    },

    first: {
        textDecoration: 'none',
        color: 'white',
        fontSize: 'medium',
        lineHeight: '10px',
        whiteSpace: 'nowrap',
    },
    nav: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: '6%',
        marginRight: '20px'
    }

});

export function Header() {
    const isLoggedIn  = useSelector(store => store.user.isLoggedIn);
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleLogin = () =>  dispatch(openForm());


    const renderUserMenu =  () => {
        if(isLoggedIn) return <UserMenu />;
        return  <Button className={classes.loginButton} variant='outlined' color="primary" onClick={handleLogin}>Увійти</Button>;
    }
    return(
        <AppBar position='static' className={classes.header}>
            
            <Typography  variant='h6' className={classes.title} component={Link} to='/' color='inherit' textDecoration='inherit'>
                <img src={logo} alt='Helsi' className={classes.logo}/>
                H E L S I
            </Typography>
            <nav className={classes.nav}>
                <List className={classes.list}>
                    <ListItem component={Link} to='/' className={classes.first}
                        color='inherit' textDecoration='inherit'>
                        Пошук лікаря
                    </ListItem>
                    <ListItem component={Link} to='/about' className={classes.listItem}
                        color='inherit' textDecoration='inherit'>
                        Про helsi
                    </ListItem>
                </List>

               {renderUserMenu()}
            </nav>
            <LoginForm>

            </LoginForm>
        </AppBar>
    ) 
}


export default Header
