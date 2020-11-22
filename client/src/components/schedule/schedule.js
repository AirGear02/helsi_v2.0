import {React, useState} from 'react';
import {makeStyles, Typography, FormControl, Button,
    InputLabel, Select, MenuItem, FormHelperText} from '@material-ui/core';

const data = {
    freeHours: [
        '09:00', '09:30', 
        '10:15', '10:30',  '10:45', 
        '11:00', '11:45'
    ],
    bookedHours: [
        '09:15', '09:45', '10:00', '11:30', '12:00', '11:15',
        '12:15', '12:30', '12:45'
    ]
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
        minHeight: '55vh',
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
    }

});

const hourRegex = title =>{ 
    return new RegExp('^' + title, 'i') }

const generateTitles = data => {
    const allHours = [...data.freeHours, ...data.bookedHours];
    const titles = new Set(allHours.map(hour => hour.split(':')[0]));
    const sortedHours = [...titles].sort();
    return sortedHours;
}

export default function Schedule(props) {
    const classes = useStyles();
    const [titles, setTitles] = useState(generateTitles(data));
    const hours = [...data.freeHours, ...data.bookedHours];
    const [value, setValue] = useState(''); 
    const [date, setDate] = useState(Date.now());
    const [hospital, setHospital] = useState('');

    const renderTitles = () => 
    
    titles.map((title, index) => (
        <div  key={index} className={classes.title}>
            <Typography className={classes.titleFont}>{title}:00</Typography>
        </div>));

    const renderSlots = (title) => (  
        <div className={classes.slotsContainer}>
            {hours.map((hour, index) => renderHours(title, hour, index))}    
        </div>
    )

    const renderHours = (title, hour, index) => {
        console.log(hour)
        if(hour.match(hourRegex(title))) {
            if(data.bookedHours.includes(hour)) {
                return (
                <div className="booked_slot_container">
                    <label>{hour}</label>
                </div>
                )
            }
            return ( 
                <div className="slot_container">
                    <input type="radio" value={hour} checked={hour===value} onChange={() => setValue(hour)} id={index}/>
                    <label htmlFor={index}>{hour}</label>
                </div>
            )
        }
    }

    return (
        <div>
            <div>

            </div>
            <div className={classes.main}>
                <div className={classes.picker}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={classes.datePicker}></input>
                <FormControl>
                    <InputLabel id="hospital-label" className={classes.whiteColor}>Поліклініка</InputLabel>
                    <Select
                        labelId="hospital-label"
                        id="hospital-label-select"
                         value = {hospital}
                        onChange={(event) => setHospital(event.target.value)}
                        className={classes.select}
                        classes={{
                            icon: classes.icon,
                            root: classes.whiteColor
                    }}
                    >
                        <MenuItem value='1'>
                            Ченівецька ЦРЛ
                        </MenuItem>
                        <MenuItem value='2'>
                            Хотинська ЦРЛ
                        </MenuItem>
                        
            </Select>
            <FormHelperText className={classes.whiteColor}>Поліклініка, де працює лікар</FormHelperText>
      </FormControl>

                   
                </div>
                <div className={classes.contentContainer}>                
                    <div>
                        {renderTitles()}
                    </div>
                    <div className={classes.hoursContainer}>
                            {titles.map(title => renderSlots(title))}
                    </div>
                </div>
               {value!== '' && <Button className={classes.button}>Записатися</Button>} 
            </div>
        </div>

    )
}