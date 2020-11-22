const express = require('express');
const WorkPlace = require('../models/WorkPlace');
const Schedule = require('../models/Schedule');

const router = express.Router();

const multer = require('multer');
const upload = multer();

router.get('/', async (req, res) => {
  const schedules = await Schedule.findAll({ include: [WorkPlace] });
  res.status(201).send(schedules);
});

/**
 *  @swagger
 *  /schedules:
 *    post:
 *      tags:
 *      - "Schedule"
 *      summary: Create new schedule
 *      description: Creates a schedule
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                start_time, end_time, workPlaceId, day_of_week
 *              properties:
 *                   start_time:
 *                      type: string
 *                      description: Start time
 *                      example: 09:00
  *                   end_time:
 *                      type: string
 *                      description: End time
 *                      example: 13:00
  *                   workPlaceId:
 *                      type: int
 *                      description: Foreign key to work place id
 *                      example: 1
 *                   day_of_week:
 *                      type: string
 *                      enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                      description: day of week
 *                      example: Monday
 *                   slot_duration:
 *                      type: int
 *                      enum: [10, 15, 20, 30, 60]
 *                      example: 15
 *      responses:
 *        201:
 *          description: Work place successfully created
 *
 *
 */
router.post("/", upload.none(), async function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const start_time = req.body.start_time;
  const end_time = req.body.end_time;
  const day_of_week = req.body.day_of_week;
  const workPlaceId = req.body.workPlaceId;
  const slot_duration = req.body.slot_duration;
  Schedule.create({ //id:id,
    start_time: start_time,
    end_time: end_time,
    day_of_week: day_of_week,
    workPlaceId: workPlaceId,
    slot_duration: `${slot_duration}m`
  }
  ).then((result) => {
    res.status(201).send(res.json(result));
  }).catch(err => console.log(err));
});
router.get("/:id", async  (req, res) => {
  if (!req.params.id) return res.sendStatus(200);
  const schedule = await Schedule.findByPk(req.params.id, { include: [WorkPlace] });
  const date = parseTime(schedule.start_time);
  //date.minutes = date.minutes + schedule.slot_duration.minutes;
  res.status(200).json({result: `${date.getHours()}:${date.getMinutes()}`})
});

function parseTime(t) {
  var d = new Date();
  var time = t.match(/(\d+)(?::(\d\d))?\s*(p?)/);
  d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
  d.setMinutes(parseInt(time[2]) || 0);
  return d;
}

router.put("/:id", (req, res) =>
  Schedule.update({
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    day_of_week: req.body.day_of_week,
    workPlaceId: req.body.workPlaceId,
  },
    {
      where: {
        id: req.params.id
      }
    }).then((result) => res.json(result))
);
router.delete("/:id", (req, res) => {

  Schedule.destroy({
    where: {
      id: req.params.id
    }
  }).then((result) => res.json(result))
});

module.exports = router;