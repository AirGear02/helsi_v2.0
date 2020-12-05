import {React} from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import DomainIcon from '@material-ui/icons/Domain';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        margin: '20px 20px',
        alignItems: 'center',
        '& img': {
            height: '110px',
            marginRight: '10px',
            borderRadius: '10px'
        }
    },
    inlineInfo: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '4px',
        '& svg': {
            marginRight: '5px'
        }
    }

});

export default function TimeSlotCard({start_time, date_visiting, doctor_name, doctor_photo, hospital, key}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <img src={doctor_photo} alt='Фото' />
            <div className={classes.info}>
                <Typography>{doctor_name}</Typography>
                <div className={classes.inlineInfo}>
                    <QueryBuilderIcon />
                    Час запису: {start_time}
                </div>
                <div className={classes.inlineInfo}>
                    <CalendarTodayIcon />
                    Дата запису: {date_visiting}
                </div>
                <div className={classes.inlineInfo}>
                    <DomainIcon />
                    Місце прийому: {hospital}
                </div>
            </div>
        </div>
    )
}