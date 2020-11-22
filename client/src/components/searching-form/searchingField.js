import {React} from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: '#fff',
      color: '#009899 !important',
      transition: 'color 0.25s, background-color 0.25s',
      width: '35ch',
      '&:hover': {
        backgroundColor: '#8DD1F3',
        color: '#fff !important',
        transition: 'color 0.25s, background-color 0.25s',
      },
      margin: 'auto',
      marginLeft: 0
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: '#009899 !!important',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      color: '#009899',
      transition: 'color 0.25s',
      [theme.breakpoints.up('sm')]: {
        width: '30ch',
        '&:focus': {
          width: '50ch',
          
        },
        '&:hover': {
          color: 'white',
          transition: 'color 0.25s'
        }
      },
    },
  }));



export default function SearchingField({handleChange}) {
    const classes = useStyles();
    return (
        <div className={classes.search}> 
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                placeholder="Знайти..."
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{className: classes.input}}
                onChange = {handleChange}
            />
        </div>
    );
}
