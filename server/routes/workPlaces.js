const express = require('express');
const WorkPlace = require('../models/WorkPlace');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const moment = require('moment');

const TimeSlotHelper = require('../utils/time-slots/timeSlotsHelper');

const multer = require('multer');
const TimeSlot = require('../models/TimeSlot');
const { Sequelize } = require('sequelize');
const { response } = require('express');
const upload = multer();

const router = express.Router();


router.get('/', async (req, res) => {
  const workPlaces = await WorkPlace.findAll({ include: [Hospital, Doctor] });
  res.status(201).send(workPlaces);
});





/**
 *  @swagger
 *  /work_places/{work_place_id}/time_slots:
 *    get:
 *      tags:
 *      - "Work place"
 *      summary: Get time slots by work place
 *      description: Get time slots by work place
 *      parameters:
 *      - in: path
 *        name: work_place_id
 *        required: true
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: Work place's id
 *        example: 1
 *      - in: query
 *        name: date
 *        required: true
 *        schema:
 *          type: string
 *        description: Time slots date
 *        example: 2020.11.23
 *      responses:
 *        200:
 *          description: Time slots successfully found
 *
 *
 */
router.get("/:work_place_id/time_slots", upload.none(), async (req, res) => {
  const date = moment(req.query.date, 'YYYY-MM-DD');
  const schedule = await Schedule.findOne({
    where: {
      workPlaceId: req.params.work_place_id,
      day_of_week: date.format('dddd'),
    },
  });

  if(schedule === null) {
    return res.status(200).json({bookedHours: [], freeHours: []});
  }

  const timeSlots = await TimeSlot.findAll({
    where: {
      scheduleId: schedule.id,
      date_visiting: { [Sequelize.Op.eq]: date.format('YYYY-MM-DD') }
    }
  });

  const orderedSlots = TimeSlotHelper.formatOrderedTimeSlots(timeSlots);
  const freeSlots = TimeSlotHelper.getFreeTimeSlots(schedule.start_time,
    schedule.end_time, schedule.slot_duration.minutes, orderedSlots, date);

  
  for(let i=0; i<freeSlots.length; i++) {
    if(date.isAfter()) break;
    if(moment(freeSlots, 'HH:mm').hours() <= moment().hours()) {
      orderedSlots.push(freeSlots[i]);
      freeSlots.splice(i, 1);
      --i;
    }
  }
  orderedSlots.sort();
  res.status(200).json({ bookedHours: orderedSlots, freeHours: freeSlots, scheduleId: schedule.id, 
    slot_duration: schedule.slot_duration.minutes});

});


router.get("/:id", async function (req, res) {
  if (!req.params.id) return res.sendStatus(200);
  WorkPlace.findByPk(req.params.id, { include: [Hospital, Doctor] }).then((result) => res.json(result))
});

router.put("/:id", (req, res) =>
  WorkPlace.update({
    cabinet_number: req.body.cabinet_number,
    hospitalId: req.body.hospitalId,
    doctorId: req.body.doctorId
  },
    {
      where: {
        id: req.params.id
      }
    }).then((result) => res.json(result))
);
router.delete("/:id", (req, res) => {

  WorkPlace.destroy({
    where: {
      id: req.params.id
    }
  }).then((result) => res.json(result))
});

router.get('/byDoctorId/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.sendStatus(400);
  const workPlaces = await WorkPlace.findAll({
    where: {
      doctorId: req.params.id
    },
    include: [Hospital, Doctor],

  });
  res.status(201).send(workPlaces);
});

module.exports = router;