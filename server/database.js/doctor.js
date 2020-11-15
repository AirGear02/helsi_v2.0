const express = require('express');
const Doctor = require('../models/Doctor');
const Person = require('../models/Person');
const JobTiltle = require('../models/JobTitle');
// const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const router = express.Router();
async function getDoctorByName(lastName){
    doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
      AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
      "personId", "person"."first_name" AS "first_name", "person"."last_name"
      AS "last_name", "person"."middle_name" AS "middle_name",
      "person"."date_born" AS "date_born", "person"."phone_number"
      AS "phone_number", "person"."email" AS "email",
      "person"."pass" AS "pass", "person"."address_id" AS "addressId",
      "person"."role" AS "role", "job_title"."id" AS "job_titleId", "job_title"."title"
      AS "job_titleTitle" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
      "doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
      WHERE "person"."last_name" LIKE ? ORDER BY last_name, first_name, job_title`,
      {
        replacements: [`%${lastName}%`],
        type: Sequelize.SELECT 
      });
      return doctors[0];
  }
  
  async function getDoctorByJob(job){
    doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
    AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
    "personId", "person"."first_name" AS "first_name", "person"."last_name"
    AS "last_name", "person"."middle_name" AS "middle_name",
    "person"."date_born" AS "date_born", "person"."phone_number"
    AS "phone_number", "person"."email" AS "email",
    "person"."pass" AS "pass", "person"."address_id" AS "addressId",
    "person"."role" AS "role", "job_title"."id" AS "job_titleId", "job_title"."title"
    AS "job_titleTitle" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
    "doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
   
    WHERE "job_title"."title" LIKE ? ORDER BY last_name, first_name, job_title`,
    {
      replacements: [`%${job}%`],
      type: Sequelize.SELECT 
    });
    return doctors[0];
  }
  async function getDoctorByCommunity(community){  
    doctors=await sequelize.sequelize.query(`Select doctor_id
    from hospitals inner join work_places on
    hospitals.id=hospital_id
    where community=?
    GROUP BY doctor_id
    ORDER BY doctor_id`,
    {
      replacements: [`${community}`],
      type: Sequelize.SELECT 
    });
    console.log(doctors[0])
    return doctors[0];
  }
  async function getDoctorByDistrict(district){
    
      doctors=await sequelize.sequelize.query(`SELECT "doctor_id" 
      FROM "persons" INNER JOIN "addresses" ON "persons"."address_id"="addresses"."id"
      WHERE "addresses"."city_village" LIKE ? AND "doctor_id">0
      GROUP BY "doctor_id"`,
      {
        replacements: [`%${district}%`],
        type: Sequelize.SELECT 
      });
     return doctors[0];
    
  }
  async function getDoctorByAddressPerson(city_village){
    doctors=await sequelize.sequelize.query(`SELECT "doctor_id" 
    FROM "persons" INNER JOIN "addresses" ON "persons"."address_id"="addresses"."id"
    WHERE "addresses"."city_village" LIKE ? AND "doctor_id">0
    GROUP BY "doctor_id"`,
    {
      replacements: [`%${city_village}%`],
      type: Sequelize.SELECT 
    });
    return doctors[0];
  }
  module.exports.getDoctorByName=getDoctorByName;
  module.exports.getDoctorByCommunity=getDoctorByCommunity;
  module.exports.getDoctorByDistrict=getDoctorByDistrict;
  module.exports.getDoctorByJob=getDoctorByJob;
  module.exports.getDoctorByAddressPerson=getDoctorByAddressPerson;