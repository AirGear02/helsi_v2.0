const express = require('express');
//const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const Person = require('../models/Person');
const Schedule = require('../models/Schedule');
const TimeSlot = require('../models/TimeSlot');

const hasRoles = require('../middleware/hasRoles');

const multer = require('multer');
const upload = multer();

const router = express.Router();
const { checkPersonFree } = require('../utilities/persons');
const { checkScheduleFree, scheduleKeepsStartEnd } = require('../utilities/schedules');

router.get('/', async (req, res) => {
  const timeSlots = await TimeSlot.findAll({ include: [Schedule, Person] });
  res.status(201).send(timeSlots);
});

/**
 *  @swagger
 *  /time_slots/:
 *    post:
 *      tags:
 *      - "Time slot"
 *      summary: Create new time slot
 *      description: Creates a new time slot
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                start_time, date_visiting, scheduleId, personId
 *              properties:
 *                   start_time:
 *                      type: string
 *                      description: Slot's time
 *                      example: 09:00
 *                   date_visiting:
 *                      type: date
 *                      description: Date of time slot
 *                      example: 1
 *                   scheduleId:
 *                      type: int
 *                      description: Foreign key to schedule 
 *                      example: 1
 *                   personId:
 *                      type: int
 *                      description: Foreign key to person 
 *                      example: 1
 *      responses:
 *        201:
 *          description: Time slot successfully created
 *
 *
 */
router.post("/", upload.none(), hasRoles(['User']),  async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const start_time = req.body.start_time;
  const end_time = req.body.end_time;
  const date_visiting = req.body.date_visiting;
  const scheduleId = req.body.scheduleId;
  const personId = req.body.user.id;

  if (start_time >= end_time) {
    console.log("error with time");
    return res.sendStatus(400);
  }
  let freeSchedule = await checkScheduleFree(scheduleId, date_visiting, start_time, end_time);
  console.log("freeSchedule", freeSchedule);
  let freePerson = await checkPersonFree(personId, date_visiting, start_time, end_time);
  console.log("freePerson", freePerson);
  let scheduleKeep = await scheduleKeepsStartEnd(scheduleId, start_time, end_time);
  console.log("scheduleKeep", scheduleKeep);
  if (freeSchedule && freePerson && scheduleKeep) {
   
  await TimeSlot.create({ //id:id,
      start_time: start_time,
      end_time: end_time,
      date_visiting: date_visiting,
      scheduleId: scheduleId,
      personId: personId
    }
    ).then((result) => {
      res.status(201).send(res.json(result));
    }).catch(err => console.log(err));
  }
  else {
    formError = {}
    if (!freePerson) {
      formError.freePerson = "this person is busy";
    }
    if (!freeSchedule) {
      formError.freeSchedule = "this schedule is busy";
    }
    if (!scheduleKeep) {
      formError.scheduleKeep = "this schedule can not have such range of time";
    }

    //console.log("error with data");
    return res.status(409).send(JSON.stringify(formError));
  }
});


router.delete("/:id", (req, res) => {
  TimeSlot.destroy({
    where: {
      id: req.params.id
    }
  }).then((result) => res.json(result))
});

module.exports = router;