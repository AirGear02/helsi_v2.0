import { React, useState} from 'react';
import { makeStyles } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import PhoneInTalkOutlinedIcon from '@material-ui/icons/PhoneInTalkOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        margin: '10px auto',
        borderRadius: '40px'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    content: {
        display: 'flex',
        '& img': {
            height: '80px',
            marginRight: '10px',
            borderRadius: '10px'
        }
    },
    infoInline: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px'
    }
}));

export default function TimeSlotCard({ first_name, last_name, middle_name, photo,
    phone_number, email, date_born, start_time }) {

    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);


    return (
        <div className={classes.root}>
            <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>{start_time.substring(0, 5)}</Typography>
                    <Typography className={classes.secondaryHeading}>
                        {first_name} {middle_name} {last_name} 
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.content}>
                        <img src={photo} alt='Фото користувача' />
                        <div className={classes.infoContainer}>
                            <div className={classes.infoInline}>
                                <EventOutlinedIcon />
                                Дата народження: {new Date(date_born).toISOString().substr(0, 10)}
                            </div>
                            <div className={classes.infoInline}>
                                <PhoneInTalkOutlinedIcon />
                                Номер телефону: {phone_number}
                            </div>
                            <div className={classes.infoInline}>
                                <EmailOutlinedIcon />
                                Електронна пошта: {email}
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );

}