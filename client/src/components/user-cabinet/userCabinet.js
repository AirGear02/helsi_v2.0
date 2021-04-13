import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import SwipeableViews from 'react-swipeable-views';
import TimeSlotCard from './timeSlotCard';
import Divider from '@material-ui/core/Divider';


axios.defaults.baseURL = "https://helsi-289508.nw.r.appspot.com/api/v1";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        maxWidth: 500,
        margin: 'auto',
        borderRadius: '20px',
        border: '6px solid #009899',
        padding: '-20px',
        boxShadow: '0px 0px 14px 0px rgba(0,0,0,0.75)'
    },
    list: {
        listStyle: 'none',
        margin: 0,
        padding: 0
    },
    appBar: {
        backgroundColor: '#009899',
        borderRadius: '20px',
        marginTop: '-10px',
        marginLeft: '-23px',
        width: '110%'
    },
    indicator: {
        margin: '0 20px 0 20px',
        width: '210px !important',
        backgroundColor: 'white'
    }
}));

export default function UserCabinet() {
    const classes = useStyles();
    const history = useHistory();
    const isLoggedIn = useSelector(store => store.user.isLoggedIn);
    const user = useSelector(store => store.user.user);
    const [data, setData] = useState({ past: [], future: [] });

    const theme = useTheme();
    const [value, setValue] = useState(0);

    if (!isLoggedIn || user.role !== 'User') {
        history.push('/');
    }

    useEffect(() => {
        axios.get('/persons/time_slots',
            { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
            .then(response => {
                setData(response.data)
            });
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };


    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    classes={{ indicator: classes.indicator }}
                >
                    <Tab label="Ваші записи" {...a11yProps(0)} />
                    <Tab label="Історія записів" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <ul className={classes.list}>
                        {data.future.map((slot, index) => (
                            <li key={index}>
                                {index !== 0 && <Divider />}
                                <TimeSlotCard {...slot} />

                            </li>
                        ))}
                    </ul>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <ul className={classes.list}>
                        {data.past.map((slot, index) => (
                            <li key={index}>
                                {index !== 0 && <Divider />}
                                <TimeSlotCard {...slot} />

                            </li>
                        ))}
                    </ul>
                </TabPanel>
            </SwipeableViews>
        </div>
    )
}
