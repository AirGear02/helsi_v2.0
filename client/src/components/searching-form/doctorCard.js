import {React, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {Button, makeStyles, Typography} from '@material-ui/core';
import ApartmentRoundedIcon from '@material-ui/icons/ApartmentRounded';
import AssignmentIndRoundedIcon from '@material-ui/icons/AssignmentIndRounded';

const useStyles = makeStyles({
    infoContainer: {
        width: '350px'
    },

    info: {
        display: 'flex',
        color: '#009899',
        margin: '10px 0'
    },
    card: {
        display: 'flex',
        margin: '20px 0',
        backgroundColor: '#E9F1F3',
        color: '#009899',
        border: '7px solid #009899',
        borderRadius: '20px',
        alignItems: 'center'
    },
    photo: {
        height: '110px',
        margin: '10px 10px',
        borderRadius: '10px'

    },
    button: {
        display: 'block',
        color: '#009899',
        borderColor: '#009899',
        border: '3px solid',
        height: '40px',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#009899',
            color: '#E9F1F3'
        }

        
    },
    title: {
        fontSize: '20px',
        fontWeight: 'bold'
    }
});

export default function DoctorCard({name, surname, middleName, hospitals, job, photo, id}) {
    const classes = useStyles();
    const history = useHistory();

    const reducedHospitals = hospitals.length <= 1 ? hospitals[0] : hospitals[0] + ', ' + hospitals[1];

    const handleClick = useCallback(() => history.push(`/schedule/${id}`), [history]);
    
    return (
        <div className={classes.card}>
            <img src={photo} className={classes.photo}/>
            <div className={classes.infoContainer}>
                <Typography className={classes.title}>{name} {middleName} {surname}</Typography>
                <div className={classes.info}>
                    <AssignmentIndRoundedIcon />
                    <Typography>Спеціальність: {job}</Typography>
                </div>
                <div className={classes.info}>
                    <ApartmentRoundedIcon />
                    <Typography>Лікарня: {reducedHospitals}</Typography>
                </div>
            </div>
            <Button className={classes.button} variant="outlined" onClick={handleClick}>Записатися</Button>
        </div>
    )
}