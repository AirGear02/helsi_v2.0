import {React} from 'react';
import {makeStyles, Typography, Divider} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BusinessIcon from '@material-ui/icons/Business';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles({
    root: {
        borderRadius: '30px',
        backgroundColor: '#009899',
        width: '25vw',
        textAlign: 'center',
        marginLeft: '13vw',
        height: 'fit-content',
        boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.75)',
        
        
        '& img': {
            height: '20vh',
            borderRadius: '15px',
            marginTop: '15px'
        }
    },
    
    containerInfo: {
        backgroundColor: '#E9F1F3', 
        margin: '15px',
        borderRadius: '10px 10px 20px 20px',
        paddingTop: '10px',
        '& hr': {
            width: '80%',
            margin: '0 auto'
        }
    },

    inlineBlock: {
        display: 'flex',
        alignItems: 'center',
        color: '#009899',
        margin: '5px 0',
        '& svg': {
            margin: '0 10px'
        }
    },

    title: {
        color: '#009899',
        fontWeight: 'bold',
        marginBottom: '10px'
    }
});

export default function DoctorCard({doctor}) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <img src={doctor.photo} alt='Фото лікаря' />
            <div className={classes.containerInfo}>
                <Typography className={classes.title}>{doctor.last_name} {doctor.first_name} {doctor.middle_name}</Typography>
                <Divider />
                <div className={classes.inlineBlock}>
                    <AccountCircleIcon />
                    {doctor.job}
                </div>
                <Divider />
                <div className={classes.inlineBlock}>
                    <BusinessIcon />
                    {doctor.hospitals.join(', ')}
                </div>
                <Divider />
                <div className={classes.inlineBlock}>
                    <MailOutlineIcon />
                    {doctor.email}
                </div>
                <Divider />
                <div className={classes.inlineBlock}>
                    <PhoneIcon />
                    {doctor.phone_number}
                </div>
                <Divider />
            </div>
        </div>
    )
}