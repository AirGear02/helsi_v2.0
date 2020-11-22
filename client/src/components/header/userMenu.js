import {React, useState, useEffect} from 'react';
import {makeStyles, Typography, IconButton, MenuItem, Menu, Avatar, withStyles, ListItemIcon, ListItemText} from '@material-ui/core';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

import {Link} from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:5000";

const useStyles = makeStyles({

  photo: {
    marginRight: '10px'
  }

});

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: '#009899',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

export default function UserMenu({handleLogoutMenu}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('');
    const [user, setUser] = useState({});

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
      handleClose();
      handleLogoutMenu();
      axios.post('/auth/logout', {
        refreshToken: localStorage.getItem('refresh_token')
      }, {headers: {Authorization: 'Bearer ' + localStorage.getItem('token') }})
      .then(res => {
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token');
        
      })
    }

    useEffect(() => {
      setUser(jwt_decode(localStorage.getItem('token')));
      axios.get('/persons/photo', {headers: {Authorization: 'Bearer ' + localStorage.getItem('token') }})
      .then(res =>  {
        if(res.data.photo !== null) setPhotoUrl(res.data.photo)
        else setPhotoUrl('');
      });

    }, []);
 

    return (
        <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit"
              >
                {photoUrl === '' && <AccountCircle className={classes.photo}/>}
                {photoUrl !== '' && <Avatar src={photoUrl} className={classes.photo}/>}
                <Typography>{user.first_name} {user.last_name}</Typography>

              </IconButton>
              <StyledMenu
                elevation={0}
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem component={Link} to="/cabinet">
                  <ListItemIcon>
                    <AssignmentOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Мої записи" />
                </StyledMenuItem>
                <StyledMenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Вийти" />
                </StyledMenuItem>
              </StyledMenu>
            </div>
    )

}
