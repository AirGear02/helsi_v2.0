const express = require('express');
const Doctor = require('../models/Doctor');
const Person = require('../models/Person');
const JobTiltle = require('../models/JobTitle');
const WorkPlace = require('../models/WorkPlace');
const Hospital = require('../models/Hospital');
const Address   = require('../models/Address');
const {Sequelize} = require('sequelize');

const router = express.Router();


router.get('/name/', async function (req, res){
  if(req.query.name === undefined) return res.status(400).json({message: 'Please input your name'});

  const words = req.query.name.split(/[\s.,-;]+/)
    .map(word => `%${word}%`)
    .filter(word => word.length>2);
  
  const operator = words.length > 2 ? Sequelize.Op.and : Sequelize.Op.or
  const persons = await Doctor.findAll({
    include: [Person, Hospital, JobTiltle],
    where: {
      [operator]:{
        '$person.first_name$': {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]:{ [Sequelize.Op.any]: words }
          }
        },
        '$person.last_name$': {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]:{ [Sequelize.Op.any]: words }
          }
        },
        '$person.middle_name$': {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]:{ [Sequelize.Op.any]: words }
          }
        }
      }
      
    }
  });
  res.status(200).json(persons.map(person => minimizeDoctor(person)));

}
  
);


router.get('/hospital/', async function (req, res){
  if(req.query.hospital === undefined) return res.status(400).json({message: 'Please input your name'});

  const hosp_name  = `%${req.query.hospital}%`;

  const persons = await Doctor.findAll({
    include: [Person, Hospital, JobTiltle],
    where: {
        '$hospitals.name_hosp$': {
            [Sequelize.Op.iLike]: hosp_name 
          }
        },
      }
      );
      res.status(200).json(persons.map(person => minimizeDoctor(person)));

}
  
);

router.get('/job/', async function (req, res){
  if(req.query.job === undefined) return res.status(400).json({message: 'Please input your name'});

  const hosp_name  = `%${req.query.job}%`;

  const persons = await Doctor.findAll({
    include: [Person, Hospital, JobTiltle],
    where: {
        '$job_title.title$': {
            [Sequelize.Op.iLike]: hosp_name 
          }
        },
      }
      );
      res.status(200).json(persons.map(person => minimizeDoctor(person)));

}
  
);

const minimizeDoctor = (doctor) => {
  const newPerson = {};
  newPerson.first_name = doctor.person.first_name;
  newPerson.last_name = doctor.person.last_name;
  newPerson.middle_name = doctor.person.middle_name;
  newPerson.job = doctor.job_title.title;
  newPerson.hospitals = doctor.hospitals.map(hosp => hosp.name_hosp);
  newPerson.photo = doctor.person.photo;
  newPerson.id = doctor.id;
  return newPerson;
}


router.get('/', async (req, res) => {
    const doctors = await Doctor.findAll({include: [Person, JobTiltle]});
    res.status(201).send(doctors);
});

router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    const personId=req.body.personId;
    const jobTitleId=req.body.jobTitleId;
    Doctor.create({ //id:id,
                    personId:personId,
                    jobTitleId:jobTitleId,                    
                    }       
                     ).then((result)=>{                    
                      res.status(201).send(res.json(result));
    }).catch(err=>console.log(err));
});


/**
*  @swagger
*  /doctors/{id}:
*    get:
*      tags:
*      - "Doctor"
*      summary: Get doctor by id
*      description: Return an existed doctor
*      security:
*        - bearerAuth: []
*      parameters:
*      - in: path
*        name: id
*        required: true
*        schema:
*          type: integer
*          minimum: 1
*        description: Doctor's id
*        example: 1
*
*      responses:
*        400:
*          description: No doctor with such id
*
*
*/
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    Doctor.findByPk(req.params.id,{include: [Person, JobTiltle, Hospital]}).then( (result) => res.json(result))
 } );


 router.put( "/:id", function(req, res){  
    console.log(req.params.id) ;
    Doctor.update({
        //personId:personId,
        jobTitleId:req.body.jobTitleId 
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )}
  );



router.delete("/:id",(req,res)=>{    
    Doctor.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
});
router.get('/byJobId/:id', async (req, res) => {
  const id=req.params.id;
  if(!id) return res.sendStatus(400);
  const doctors = await Doctor.findAll({
      where:{
        jobTitleId:req.params.id
      },   
      include: [Person, JobTiltle],
      
  });
  res.status(201).send(doctors);
});


router.get('/byPersonId/:id', async (req, res) => {
  const id=req.params.id;
  if(!id) return res.sendStatus(400);
  const doctors = await Doctor.findAll({
      where:{
        personId:req.params.id
      },   
      include: [Person, JobTiltle],
      
  });
  res.status(201).json(doctors[0]);
});



module.exports = router;