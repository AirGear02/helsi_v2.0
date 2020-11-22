import { React, useState, useEffect} from 'react';
import {FormControl, InputLabel, MenuItem, FormHelperText, Select, makeStyles} from '@material-ui/core';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:5000";

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
        }
    },
    icon: {
        fill: 'white',
    }

});

export default function CitiesDropdown({handleChange}) {
    const classes = useStyles();
    const [cities, setCities] = useState([]);
    const [value, setValue] = useState('');
    
    useEffect(() => {
        axios.get('/addresses/cities')
            .then(res => setCities(res.data.cities));
    },[]);

    const renderCities = () => cities.map((city, index) => <MenuItem value={city} key={index}>{city}</MenuItem>);

    const handleChangeValue = (event) => setValue(event.target.value);

    return (
        <FormControl>
            <InputLabel id="city-label" className={classes.whiteColor}>Місто</InputLabel>
            <Select
                labelId="city-label"
                id="city-label-select"
                value = {value}
                onChange={handleChangeValue}
                className={classes.select}
                classes={{
                    
                        icon: classes.icon,
                        root: classes.whiteColor
                }}
            >
            <MenuItem value=''>
            <em>None</em>
          </MenuItem>
                {cities.length!==0 && renderCities()}
            </Select>
            <FormHelperText className={classes.whiteColor}>Місто, в якому шукаєте лікаря</FormHelperText>
      </FormControl>
    );
}

