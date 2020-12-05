const express = require('express');
//const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const Person = require('../models/Person');
const Schedule = require('../models/Schedule');
const TimeSlot = require('../models/TimeSlot');
const moment = require('moment');

const sequelize = require('../config/database');
const { putToTimeRange } = require('./timeslot');
const { getScheduleById, getScheduleFree } = require('../database.js/schedules');


const router = express.Router();
async function scheduleKeepsStartEnd(schedule_id,st_time, e_time){
    let scheduleRes=await getScheduleById(schedule_id).then(result=>result);  
    let schedule_start=moment(scheduleRes[0].start_time, 'HH:mm:SS');    
    let schedule_end=moment(scheduleRes[0].end_time, 'HH:mm:SS');
    let start=moment(st_time, 'HH:mm');
    let end=moment(e_time, 'HH:mm'); 
   
    return schedule_start<=start && schedule_end>=end;
   
    
}
function fromStringToTime(timeString,current_date){
    let timeArr=timeString.split(':'); 
    let date=new Date(current_date.getTime());   
    date.setHours(timeArr[0],timeArr[1], timeArr[2]);
    return date.getTime();
}
async function checkScheduleFree(schedule_id,dat_visiting,start_time,end_time){
    let arrVisiting=[];
    let res=true;
      const result= await getScheduleFree(schedule_id,dat_visiting,start_time,end_time)
        .then(result=>result.forEach(item=>{
            arrVisiting.push({
              "start_time":item.start_time,
              "end_time":item.end_time
            });       
        }))
        if(arrVisiting.length==0){
          res=true;
        }
        else{
          res=putToTimeRange(arrVisiting,start_time,end_time);
        }
        
        console.log(arrVisiting);
        
    return res;
    
    }
    module.exports.scheduleKeepsStartEnd=scheduleKeepsStartEnd;
    module.exports.checkScheduleFree=checkScheduleFree;