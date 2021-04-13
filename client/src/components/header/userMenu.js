import { React, useState, useEffect } from 'react';
import { makeStyles, Typography, IconButton, MenuItem, Menu, Avatar, withStyles, ListItemIcon, ListItemText, useRadioGroup } from '@material-ui/core';
import axios from 'axios';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';

import { logout } from '../../actions/auth';


axios.defaults.baseURL = "https://helsi-289508.nw.r.appspot.com/api/v1";

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

export default function UserMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const user = useSelector(store => store.user.user);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());

    axios.post('/auth/logout', {
      refreshToken: localStorage.getItem('refresh_token')
    }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(res => {
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token');

      })
  }

  useEffect(() => {
    //setUser(jwt_decode(localStorage.getItem('token')));
    axios.get('/persons/photo', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(res => {
        if (res.data.photo !== null) setPhotoUrl(res.data.photo)
        else setPhotoUrl('');
      });

  }, [user]);

  const renderUserCabinet = () => {
    if (user.role === 'User') {
      return (
        <StyledMenuItem component={Link} onClick={handleClose} to="/cabinet">
          <ListItemIcon>
            <AssignmentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Мої записи" />
        </StyledMenuItem>
      )
    }
  }

  const renderDoctorCabinet = () => {
    if (user.role === 'Doctor') {
      return (
        <StyledMenuItem component={Link} onClick={handleClose} to="/doctor_cabinet">
          <ListItemIcon>
            <BallotOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Записи до мене" />
        </StyledMenuItem>
      )
    }
  }

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        {photoUrl === '' && <AccountCircle className={classes.photo} />}
        {photoUrl !== '' && <Avatar src={photoUrl} className={classes.photo} />}
        <Typography style={{ whiteSpace: 'nowrap' }}>{user.first_name} {user.last_name}</Typography>

      </IconButton>
      <StyledMenu
        elevation={0}
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {renderUserCabinet()}
        {renderDoctorCabinet()}
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
