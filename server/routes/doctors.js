const express = require('express');
const Doctor = require('../models/Doctor');
const Person = require('../models/Person');
const JobTiltle = require('../models/JobTitle');
const WorkPlace = require('../models/WorkPlace');
const Hospital = require('../models/Hospital');
const Address = require('../models/Address');
const { Sequelize } = require('sequelize');
const moment = require('moment')

const router = express.Router();

const multer = require('multer');
const hasRoles = require('../middleware/hasRoles');
const TimeSlot = require('../models/TimeSlot');
const Schedule = require('../models/Schedule');
const upload = multer();


router.get('/name/', async function (req, res) {
  if (req.query.name === undefined) return res.status(400).json({ message: 'Please input your name' });

  const words = req.query.name.split(/[\s.,-;]+/)
    .map(word => `%${word}%`)
    .filter(word => word.length > 2);
  const options = { model: Hospital };
  let addOptions = {};
  if (req.query.city !== undefined && req.query.city !== '') {
    options.include = [{ model: Address, where: { city_village: req.query.city } }]
    addOptions = { '$hospitals->address.id$': { [Sequelize.Op.ne]: null } }
  }
  const operator = words.length > 2 ? Sequelize.Op.and : Sequelize.Op.or
  const persons = await Doctor.findAll({
    include: [Person, options, JobTiltle],
    order: [['id', 'DESC']],
    where: {
      [operator]: {
        '$person.first_name$': {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]: { [Sequelize.Op.any]: words }
          }
        },
        '$person.last_name$': {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]: { [Sequelize.Op.any]: words }
          }
        },
        '$person.middle_name$': {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]: { [Sequelize.Op.any]: words }
          }
        },

      },
      ...addOptions

    }
  });
  res.status(200).json(persons.map(person => minimizeDoctor(person)));

}

);


router.get('/hospital/', async function (req, res) {
  if (req.query.hospital === undefined) return res.status(400).json({ message: 'Please input your name' });

  const hosp_name = `%${req.query.hospital}%`;
  const options = { model: Hospital };
  let addOptions = {};
  if (req.query.city !== undefined && req.query.city !== '') {
    options.include = [{ model: Address, where: { city_village: req.query.city } }]
    addOptions = { '$hospitals->address.id$': { [Sequelize.Op.ne]: null } }
  }
  const persons = await Doctor.findAll({
    include: [Person, options, JobTiltle],
    where: {
      '$hospitals.name_hosp$': {
        [Sequelize.Op.iLike]: hosp_name
      },
      ...addOptions
    },

  }
  );
  res.status(200).json(persons.map(person => minimizeDoctor(person)));

}

);

router.get('/job/', async function (req, res) {
  if (req.query.job === undefined) return res.status(400).json({ message: 'Please input your name' });

  const hosp_name = `%${req.query.job}%`;
  const options = { model: Hospital };
  let addOptions = {};
  if (req.query.city !== undefined && req.query.city !== '') {
    options.include = [{ model: Address, where: { city_village: req.query.city } }]
    addOptions = { '$hospitals->address.id$': { [Sequelize.Op.ne]: null } }
  }
  const persons = await Doctor.findAll({
    include: [Person, options, JobTiltle],
    where: {
      '$job_title.title$': {
        [Sequelize.Op.iLike]: hosp_name
      },
      ...addOptions
    },
  }
  );
  res.status(200).json(persons.map(person => minimizeDoctor(person)));

}

);


/**
 *  @swagger
 *  /api/v1/doctors/{doctor_id}/work_places:
 *    post:
 *      tags:
 *      - "Work place"
 *      summary: Create new work place
 *      description: Creates a doctor's work place
 *      parameters:
 *      - in: path
 *        name: doctor_id
 *        required: true
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: Doctor's id
 *        example: 1
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                hospitalId, cabinet_number
 *              properties:
 *                   hospitalId:
 *                      type: int
 *                      description: Foreign key to hospitalId
 *                      example: 1
 *                   cabinet_number:
 *                      type: int
 *                      description: cabinet number
 *                      example: 1
 *      responses:
 *        201:
 *          description: Work place successfully created
 *
 *
 */
router.post("/:doctor_id/work_places", upload.none(), async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  req.body.doctorId = req.params.doctor_id;
  const workPlace = await WorkPlace.create(req.body);
  res.status(201).json({ message: 'Work place is successfully created', workPlace: workPlace });
});


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


/**
 *  @swagger
 *  /api/v1/doctors/time_slots/:
 *    get:
 *      tags:
 *      - "Doctor"
 *      summary: Get timeslots of current doctor by workPlace and id
 *      description: Get timeslots of current doctor by workPlace and id
 *      parameters:
 *      - in: query
 *        name: work_place
 *        required: true
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: workPlaceId
 *        example: 34
 *      - in: query
 *        name: date
 *        required: true
 *        schema:
 *          type: string
 *        description: date
 *        example: 2020.11.30
 *      responses:
 *        201:
 *          description: Work place successfully created
 *
 *
 */
router.get('/time_slots', upload.none(), async (req, res) => {
  const date = moment(req.query.date, 'YYYY-MM-DD');
  const workPlace = req.query.work_place;
  const timeSlots = await WorkPlace.findByPk(workPlace, {
    attributes: [],
    include: [
      {
        model: Schedule,
        attributes: ['workPlaceId'],
        include: [{
          model: TimeSlot,

          where: { date_visiting: { [Sequelize.Op.eq]: date.format('YYYY-MM-DD') } },
          include: [{
            model: Person, attributes: ['first_name', 'last_name', 'middle_name', 'photo',
              'phone_number', 'email', 'date_born']
          }],
          attributes: ['start_time'],
        }],

      }
    ],

  });
  return res.status(200).json(timeSlots.schedules[0].timeSlots);
});

router.get('/', async (req, res) => {
  const doctors = await Doctor.findAll({ include: [Person, JobTiltle] });
  res.status(201).send(doctors);
});


router.post("/", async function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const personId = req.body.personId;
  const jobTitleId = req.body.jobTitleId;
  Doctor.create({ //id:id,
    personId: personId,
    jobTitleId: jobTitleId,
  }
  ).then((result) => {
    res.status(201).send(res.json(result));
  }).catch(err => console.log(err));
});


/**
*  @swagger
*  /api/v1/doctors/{id}:
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
router.get("/:id", async function (req, res) {
  if (!req.params.id) return res.sendStatus(200);
  Doctor.findByPk(req.params.id, { include: [Person, JobTiltle, Hospital, WorkPlace] })
    .then((result) => res.json(minimizeDoctorEager(result)));
});

const minimizeDoctorEager = (doctor) => {
  const newDoctor = minimizeDoctor(doctor);
  newDoctor.email = doctor.person.email;
  newDoctor.phone_number = doctor.person.phone_number;
  newDoctor.workPlaces = doctor.hospitals.map(hospital => { return { id: hospital.workPlace.id, name: hospital.name_hosp } });
  return newDoctor;
}


router.put("/:id", function (req, res) {
  console.log(req.params.id);
  Doctor.update({
    //personId:personId,
    jobTitleId: req.body.jobTitleId
  },
    {
      where: {
        id: req.params.id
      }
    }).then((result) => res.json(result))
}
);



router.delete("/:id", (req, res) => {
  Doctor.destroy({
    where: {
      id: req.params.id
    }
  }).then((result) => res.json(result))
});
router.get('/byJobId/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.sendStatus(400);
  const doctors = await Doctor.findAll({
    where: {
      jobTitleId: req.params.id
    },
    include: [Person, JobTiltle],

  });
  res.status(201).send(doctors);
});


router.get('/byPersonId/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.sendStatus(400);
  const doctors = await Doctor.findAll({
    where: {
      personId: req.params.id
    },
    include: [Person, JobTiltle],

  });
  res.status(201).json(doctors[0]);
});



module.exports = router;