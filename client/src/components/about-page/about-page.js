import {React} from 'react';
import {Typography, makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
    title:{
        margin: '0 auto',
        textAlign: 'center',
        fontSize: '25px',
        color: '#009899',
        width: '60%',
        fontWeight: 'bold'
    }
})

export default function AboutPage() {
    const classes = useStyles();

    return (
        <Typography className={classes.title}>
            Даний додаток розробили: Герасимчук Анастасія, Зубрій Назар, Ковінько Ольга, 
            Дробот Андрій, Гарвасюк Владислав, в якості проекту для заліку з проeктування програмних систем 
        </Typography>
    )
}