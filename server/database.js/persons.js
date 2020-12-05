const express = require('express');
const Doctor = require('../models/Doctor');
const Person = require('../models/Person');
const JobTiltle = require('../models/JobTitle');
// const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const { putToTimeRange } = require('../utilities/timeslot');
const router = express.Router();
const moment = require('moment');
async function getPersonFree(person_id,date_Visiting,start_time){  
    //let dateVisiting=(new Date(date_Visiting));
    // const dateVisiting = moment(date_Visiting, 'YYYY-MM-DD');
    // console.log("date",dateVisiting,"date");
       let dateVisiting=date_Visiting;
        persons=await sequelize.query(`Select * From "time_slots" where "person_id"=:person_id
         AND "date_visiting"=:dateVisiting 
         order by start_time   
        `,
        {
            replacements: { person_id: person_id,dateVisiting:dateVisiting},
     
        type: Sequelize.SELECT 
        });    
        return persons[0];
    }

module.exports.getPersonFree=getPersonFree;