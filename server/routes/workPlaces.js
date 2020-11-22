const express = require('express');
const WorkPlace = require('../models/WorkPlace');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

const multer = require('multer');
const upload = multer();

const router = express.Router();


router.get('/', async (req, res) => {
  const workPlaces = await WorkPlace.findAll({ include: [Hospital, Doctor] });
  res.status(201).send(workPlaces);
});


/**
 *  @swagger
 *  /doctors/{doctor_id}/work_places:
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
  res.status(201).json({message: 'Work place is successfully created', workPlace: workPlace});
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