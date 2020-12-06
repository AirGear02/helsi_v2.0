import { React, useState, useEffect } from 'react';
import axios from 'axios';
import {
    makeStyles, Typography, FormControl, Button,
    InputLabel, Select, MenuItem, FormHelperText,
    Snackbar
} from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openForm } from '../../actions/loginForm';
import moment from 'moment';
import DoctorCard from './doctor-card';
import DatePicker from './date-picker';


function Alert(props) {
    return <MuiAlert elevation={10} variant="filled" {...props} />;
}

const useStyles = makeStyles({
    slotsContainer: {
        display: 'flex',
        height: '6vh',
        alignItems: 'center',
        marginTop: '20px'
    },
    radioContainer: {
        'input:checked + label': {
            backgroundColor: 'black'
        }
    },
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
        width: '40%',
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
    title: {
        backgroundColor: '#E9F1F3',
        height: '6vh',
        width: '6vw',
        margin: '20px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    titleFont: {
        fontSize: '23px'
    },
    hoursContainer: {
        backgroundColor: '#ECECEC',
        borderRadius: '10px',
        padding: '0 10px'
    },
    button: {
        display: 'block',
        margin: 'auto',
        color: 'white',
        borderColor: 'white',
        border: '2px solid white',
        borderRadius: '10px'
    },
    root: {
        display: 'flex'
    },
    message: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: '5vh'
    }

});

const hourRegex = title => {
    return new RegExp('^' + title, 'i')
}

const generateTitles = data => {
    const allHours = [...data.freeHours, ...data.bookedHours];
    const titles = new Set(allHours.map(hour => hour.split(':')[0]));
    const sortedHours = [...titles].sort();
    return sortedHours;
}

export default function Schedule(props) {
    const classes = useStyles();
    const { doctorId } = useParams();

    const [doctor, setDoctor] = useState({hospitals: [],  workPlaces: [] });
    const [titles, setTitles] = useState([]);
    const [hours, setHours] = useState([]);
    const [data, setData] = useState(null);
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0,10));
    const [hospital, setHospital] = useState(0);
    const isLoggedIn = useSelector(store => store.user.isLoggedIn);
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(`/doctors/${doctorId}`)
            .then(res => {

                setDoctor(res.data);
                console.log(res.data);
                setHospital(res.data.workPlaces[0].id);
            });

    }, [doctorId]);

    useEffect(() => {
        setValue('');
        axios.get(`/work_places/${hospital}/time_slots/?date=${date}`)
            .then(res => {
                setAllData(res.data);
                
            }
            )
    }, [hospital, date])

    const setAllData = (data) => {
        setData(data);
        const union_hours = [...data.freeHours, ...data.bookedHours];
        setTitles(generateTitles(data));
        union_hours.sort();
        setHours(union_hours);
    }

    const renderTitles = () =>
        titles.map((title, index) => (
            <div key={index} className={classes.title}>
                <Typography className={classes.titleFont}>{title}:00</Typography>
            </div>));

    const renderSlots = (title) => (
        <div className={classes.slotsContainer}>
            {hours.map((hour, index) => renderHours(title, hour, index))}
        </div>
    )

    const renderHospitals = () => {
        return doctor.workPlaces.map(workPlace =>
            <MenuItem value={workPlace.id} key={workPlace.id}>{workPlace.name}</MenuItem>
        )
    }

    const renderHours = (title, hour, index) => {
        if (hour.match(hourRegex(title))) {
            if (data.bookedHours.includes(hour)) {
                return (
                    <div className="booked_slot_container">
                        <label>{hour}</label>
                    </div>
                )
            }
            return (
                <div className="slot_container">
                    <input type="radio" value={hour} checked={hour === value} onChange={() => setValue(hour)} id={index} />
                    <label htmlFor={index}>{hour}</label>
                </div>
            )
        }
    }
    const handleSubmit = () => {
        if(!isLoggedIn) {
            dispatch(openForm());
            return;
        }

        
        const end_time = moment(value, 'HH:mm').add(data.slot_duration, 'minute').format('HH:mm');
        axios.post('/time_slots', {
            start_time: value,
            date_visiting: date,
            scheduleId: data.scheduleId,
            end_time: end_time
        }, {headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }})
        .then(response => {
            
            const newData = data;
            newData.bookedHours = newData.bookedHours.concat(value);
            newData.freeHours = newData.freeHours.filter(hour => hour !== value);
            setAllData(newData);
            setValue('');
            setIsMessageOpen(true);
        });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsMessageOpen(false);
    };

    const renderSchedule = () => {
        if(data.bookedHours.length === 0 &&  data.freeHours.length === 0) {
            return (
            <div className={classes.contentContainer}>
                <Typography className={classes.message}>На жаль, лікар не працює в цей день</Typography>
            </div> 
            )
        }

        return (
            <div className={classes.contentContainer}>
                <div>
                    {renderTitles()}
                </div>
                <div className={classes.hoursContainer}>
                    {titles.map(title => renderSlots(title))}
                </div>
            </div>
        )
    }

    const handleChangeDate = (value) => setDate(value.format('YYYY-MM-DD'))

    return (
        <div className={classes.root}>
            <DoctorCard doctor={doctor}/>
            <div className={classes.main}>
                <div className={classes.picker}>
                    <DatePicker handleSubmit={handleChangeDate}/>
                    <FormControl>
                        <InputLabel id="hospital-label" className={classes.whiteColor}>Поліклініка</InputLabel>
                        <Select
                            labelId="hospital-label"
                            id="hospital-label-select"
                            value={hospital}
                            onChange={(event) => setHospital(event.target.value)}
                            className={classes.select}
                            classes={{
                                icon: classes.icon,
                                root: classes.whiteColor
                            }}
                        >
                            {renderHospitals()}
                        </Select>
                        <FormHelperText className={classes.whiteColor}>Поліклініка, де працює лікар</FormHelperText>
                    </FormControl>


                </div>
                {data!== null && renderSchedule()}
                {value !== '' && <Button className={classes.button} onClick={handleSubmit}>Записатися</Button>}
            </div>
            <Snackbar open={isMessageOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity="success">Вітаємо, Ви успішно записались до лікаря!</Alert>
            </Snackbar>
        </div>

    )
}