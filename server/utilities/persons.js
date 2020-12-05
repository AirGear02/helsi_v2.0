const { getPersonFree } = require('../database.js/persons');
const express = require('express');
const Doctor = require('../models/Doctor');
const Person = require('../models/Person');
const JobTiltle = require('../models/JobTitle');
// const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const { putToTimeRange } = require('../utilities/timeslot');
const router = express.Router();

async function checkPersonFree(person_id,dat_visiting,start_time,end_time){
let arrVisiting=[];

    let res;
      const result= await getPersonFree(person_id,dat_visiting,start_time,end_time)
        .then(result=>result.forEach(item=>{
            arrVisiting.push({
              "start_time":item.start_time,
              "end_time":item.end_time
            });       
        }))
    
        //console.log(arrVisiting);
        if(arrVisiting.length==0)//якщо немає записів у персон
        {
          console.log("ZERO");
          res=true;
        }
        else{
          res=putToTimeRange(arrVisiting,start_time,end_time);
        }
        
        //console.log(res);
        
    return res;
    
    }
module.exports.checkPersonFree=checkPersonFree;