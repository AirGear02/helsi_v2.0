import Header from './components/header/header';
import Footer from './components/footer/footer';
import UserCabinet from './components/user-cabinet/userCabinet';
import DoctorCabinet from './components/doctor-cabinet/doctorCabinet';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import SearchingForm from './components/searching-form/searchingForm';
import {makeStyles} from '@material-ui/core';
import Schedule from './components/schedule/schedule';

const useStyles = makeStyles({
  main: {
    padding: '5em 0',
    minHeight: '82vh',
    boxSizing: 'border-box',
    
  }
})


function App() {
  const classes = useStyles();
  return (
    <Router>
      <Header />
      
      <div className={classes.main}>
      <Switch>
          <Route path="/about">
            <h1>About helsi</h1>
          </Route>
          <Route path="/schedule/:doctorId">
            <Schedule />
          </Route>
          <Route path="/cabinet">
            <UserCabinet />
          </Route>
          <Route path="/doctor_cabinet">
            <DoctorCabinet />
          </Route>
          <Route exact path="/">
            <SearchingForm />
          </Route>
        </Switch>
        
      </div>
     
      <Footer />

    </Router>
  );
}

export default App;
