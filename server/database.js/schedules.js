const express = require('express');
//const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const Person = require('../models/Person');
const Schedule = require('../models/Schedule');
const TimeSlot = require('../models/TimeSlot');

const sequelize = require('../config/database');
const { putToTimeRange } = require('../utilities/timeslot');


const router = express.Router();
async function getScheduleById(schedule_id){   
    schedules=await sequelize.sequelize.query(`Select * From "schedules" where "id"=:schedule_id`,
        {
            replacements: { schedule_id:schedule_id},
     
        type: Sequelize.SELECT 
        }); 
return schedules[0];
 
}

async function getScheduleFree(schedule_id,date_visiting,start_time,end_time){  
    let dateVisiting=(new Date(date_visiting));
    //console.log(dateVisiting);
    
        schedule=await sequelize.sequelize.query(`Select * From "time_slots" where "schedule_id"=:scheduleId
         AND "date_visiting"=:dateVisiting 
         order by start_time   
        `,
        {
            replacements: { scheduleId: schedule_id,dateVisiting:dateVisiting},
     
        type: Sequelize.SELECT 
        }); 
        //console.log("OK",schedule[0]); 
        return schedule[0];
    }

module.exports.getScheduleById=getScheduleById;
module.exports.getScheduleFree=getScheduleFree;

