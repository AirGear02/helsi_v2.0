import moment from "moment";
import MomentUtils from "@date-io/moment";
import MoreIcon from "@material-ui/icons/MoreVert";
import React, { useState, useCallback } from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider, makeStyles } from "@material-ui/styles";

import "moment/locale/uk";

moment.locale("uk"); // it is required to select default locale manually

const materialTheme = createMuiTheme({
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: '#009899',
            },
        },
        MuiPickersDay: {
            '&:hover': {
                backgroundColor: '#009899',
            },
            daySelected: {
                backgroundColor: '#009899',
            },
        },
    }
    }
);


const useStyles = makeStyles({
    input: {
        color: 'white',
        '&:before': {
            borderColor: 'white'
        },
        '&:hover:before': {
            borderColor: 'white'
        },
        width: '12vw'
    },

    root: {
        '& svg': {
            color: 'white'
        },
        marginRight: '10%',
        marginBottom: '6px'
    }

})



export default function DatePicker({handleSubmit}) {
   
    const classes = useStyles();
    const [selectedDate, handleDateChange] = useState(new Date());
    



    return (
        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="uk">
            <ThemeProvider theme={materialTheme}>
                <KeyboardDatePicker
                    value={selectedDate}
                    views={["month", "date"]}
                    onChange={date => handleDateChange(date)}
                    disablePast={true}
                    okLabel='Вибрати'
                    cancelLabel='Скасувати'
                    id='kek'
                    InputProps={{ className: classes.input}}
                    className={classes.root}
                    onAccept={handleSubmit}
                    
                />
            </ThemeProvider>

        </MuiPickersUtilsProvider>
    );
}
