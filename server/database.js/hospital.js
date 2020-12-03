const express = require('express');
const Hospital = require('../models/Hospital');
const Address = require('../models/Address');
const router = express.Router();
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
async function getHospitalsByIdDoctor(doctorId){
    doctors=await sequelize.query(`SELECT *
    FROM "work_places" INNER JOIN "hospitals" ON "hospitals"."id"="work_places"."hospital_id"
    WHERE "doctor_id"=:doctor_id`,
    {
      replacements: { doctor_id: doctorId},
      type: Sequelize.SELECT 
    });
    return doctors[0];
}
module.exports.getHospitalsByIdDoctor=getHospitalsByIdDoctor;