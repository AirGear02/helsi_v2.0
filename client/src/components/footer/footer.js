import { React } from "react";
import {Typography, makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    width: '100%',
    height: '8vh',
    background: '#009899',
    borderRadius: '70px 70px  0 0',
    boxShadow: ' -1px -7px 13px -10px rgba(0,0,0,0.75)'
  }
});

 export default function Footer(){
    return (
      <div>
        <Typography variant='subtitle2' className={useStyles().container}> 
            &copy; {new Date().getFullYear()} Copyright: Helsi TEAM
        </Typography>
      </div>
    );
}