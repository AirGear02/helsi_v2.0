import {React, useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {makeStyles, FormControl, Select, InputLabel, FormHelperText, MenuItem, Divider} from '@material-ui/core';
import TimeSlotCard from './timeSlotCard';
import axios from 'axios';


const useStyles = makeStyles({
    whiteColor: {
        color: 'white !important'
    },
    select: {
        '&:before': {
            borderColor: 'white',
        },
        '&:after': {
            borderColor: 'white',
        },
        width: '15vw',

    },
    icon: {
        fill: 'white',
    },
    main: {
        margin: 'auto',
        width: '50%',
        backgroundColor: '#009899',
        padding: '2vh 0',
        borderRadius: '30px',
        minHeight: '45vh',
        boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.75)'
    },

    picker: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    datePicker: {
        marginRight: '4vw',
        width: '15vw'
    },
    contentContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '10px 0'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    divider: {
        backgroundColor: 'white',
        width: '90%',
        margin: '10px auto'
    }
});

export default function DoctorCabinet() {
    const user = useSelector(store => store.user.user)
    const isLoggedIn = useSelector(store => store.user.isLoggedIn);
    const history = useHistory();
    const [workPlaces, setWorkPlaces] = useState([]);
    const [currentWorkPlace, setCurrentWorkPlace] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [timeSlots, setTimeSlots] = useState([]);
    const classes = useStyles();
    

    if(!isLoggedIn || user.role !== 'Doctor') {
        history.push('/');
    }
    useEffect(() => {
        async function fetchHospitals() {
            const result = await axios.get(`/doctors/${user.doctorId}`);
            setWorkPlaces(result.data.workPlaces);
            setCurrentWorkPlace(result.data.workPlaces[0].id);
        }
        if(isLoggedIn) fetchHospitals();
    }, []);

    useEffect(() => {
        async function fetchTimeSlots() {
            const result = await axios.get(`/doctors/time_slots/?date=${date}&work_place=${currentWorkPlace}`);
            result.data.sort((a,b) => a.start_time >  b.start_time ? 1 : -1);
            setTimeSlots(result.data);
        }
        if(currentWorkPlace !== 0) fetchTimeSlots();
    }, [date, currentWorkPlace])

    const renderWorkPlaces = () => {
        return workPlaces.map(workPlace =>
            <MenuItem value={workPlace.id} key={workPlace.id}>{workPlace.name}</MenuItem>
        )
    }

    return (
        <div>
            <div className={classes.main}>
                <div className={classes.picker}>
                    <input type="date" value={date}
                        onChange={(e) => setDate(new Date(e.target.value).toISOString().slice(0, 10))}
                        className={classes.datePicker}></input>
                    <FormControl>
                        <InputLabel id="hospital-label" className={classes.whiteColor}>Поліклініка</InputLabel>
                        <Select
                            labelId="hospital-label"
                            id="hospital-label-select"
                            value={currentWorkPlace}
                            onChange={(event) => setCurrentWorkPlace(event.target.value)}
                            className={classes.select}
                            classes={{
                                icon: classes.icon,
                                root: classes.whiteColor
                            }}
                        >
                            {renderWorkPlaces()}
                        </Select>
                        <FormHelperText className={classes.whiteColor}>Поліклініка, де Ви працюєте</FormHelperText>
                    </FormControl>


                </div>
                <Divider className={classes.divider}/>
                <div>
                    <ul className={classes.list}>     
                        {timeSlots.map((timeSlot, index) => <li key={index}><TimeSlotCard start_time={timeSlot.start_time} {...timeSlot.person} /></li>)}
                    </ul>
                </div>
            </div>
        </div>
    )


    
}