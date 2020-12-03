import {React, useState} from 'react';
import {makeStyles, Button, FormControl, RadioGroup, FormControlLabel, Radio, Typography, Divider} from '@material-ui/core';
import SearchingField from './searchingField';
import CitiesDropdown from './citiesDropdown';
import axios from 'axios';
import DoctorCard from './doctorCard';

axios.defaults.baseURL = "http://localhost:5000";

const ITEMS_PER_PAGE = 5;

const useStyles = makeStyles({
    form: {
        backgroundColor: '#009899',
        width: '100vh',
        margin: 'auto',
        padding: '10px 40px ',
        borderRadius: '30px',
        boxShadow: '0px 0px 37px -10px rgba(0,0,0,0.75)'

    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '2vh',
    },
    button: {
        display: 'block',
        margin: 'auto',
        color: 'white',
        borderColor: 'white'
    },
    raadioGroup: {
        display: 'flex',
        flexDirection: 'row'
    },
    typeForm: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: '1%'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '10%',
        color: 'white'
    }, 
    dividerColor: {
        background: '#fff'
    },
    radio: {
        color: '#fff',
        '&$checked': {
            color: '#fff'
        }
    },
    label:{
        color: '#fff'
    },
    checked: {},
    doctorsContainer: {
        backgroundColor: '#E9F1F3',
        borderRadius: '20px',
        padding: '10px 20px',
        marginBottom: '3vh',
        position: 'relative'
    },
    nextPageButton: {
        position: 'fixed',
        borderRadius: '50%',
        bottom: '10px'

    }
});

export default function SearchingForm() {
    const classes = useStyles();
    const [searchType, setSearchType] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [currPage, setPage] = useState(1);

    const handleSearchTypeChange = event => setSearchType(event.target.value);
    const handleQueryChange = event => setSearchQuery(event.target.value);

    const searchHandle = () => {
        axios.get(`/doctors/${searchType}/?${searchType}=${searchQuery}`)
        .then(res => setDoctors(res.data));
    }

    const renderDoctors = () => {
        return doctors.map((doctor, index) => (
            <DoctorCard name={doctor.first_name} surname={doctor.last_name} middleName={doctor.middle_name}
                job={doctor.job} photo={doctor.photo} hospitals={doctor.hospitals} key={index} id={doctor.id}
            />
        ))
    }

    return (
        <div className={classes.form}>
            <div className={classes.searchContainer}>
                <SearchingField handleChange={handleQueryChange}/>
                <CitiesDropdown />
                <Button className={classes.button} variant="outlined" onClick={searchHandle}>Знайти</Button>
            </div>
            <Divider classes={{root: classes.dividerColor}}/>
            <FormControl component="fieldset" className={classes.typeForm}>
                <Typography variant="subtitle1" className={classes.title}>Пошук за:</Typography>
                <RadioGroup aria-label="search-type" name="searchType" 
                    value={searchType} 
                    onChange={handleSearchTypeChange}
                    className={classes.raadioGroup}
                >
                    <FormControlLabel value="name" className={classes.label}
                        control={<Radio classes={{root: classes.radio, checked: classes.checked}}/>} label="Ім'ям" />
                    <FormControlLabel value="job" className={classes.label}
                        control={<Radio classes={{root: classes.radio, checked: classes.checked}}/>} label="Спеціальністю" />
                    <FormControlLabel value="hospital" className={classes.label}
                        control={<Radio classes={{root: classes.radio, checked: classes.checked}}/>} label="Назвою закладу" />
                </RadioGroup>
            </FormControl>
            {doctors.length !== 0 && <div className={classes.doctorsContainer}>
                {renderDoctors()}
                
            </div>
            }
        </div>
    );
}