const express = require('express');

const { Sequelize } = require('sequelize');
const hasRoles = require('../middleware/hasRoles');
const createFile = require('../utils/google-cloud/create-file');
const removeFile = require('../utils/google-cloud/remove-file');
const moment = require("moment")

const personCreate = require('../validation/person/personCreate');
const personUpdate = require('../validation/person/personUpdate');
const timeSlotsHelper = require('../utils/time-slots/timeSlotsHelper');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  fileSize: 5 * 1024 * 1024,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const router = express.Router();
const bcrypt = require('bcrypt');
const Person = require('../models/Person');
const Address = require('../models/Address');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');


const TimeSlot = require('../models/TimeSlot');
const WorkPlace = require('../models/WorkPlace');
const Hospital = require('../models/Hospital');

const SALT_ROUND = 10;

/**
 *  @swagger
 *  /api/v1/persons/:
 *    post:
 *      tags:
 *      - "Person"
 *      summary: Create person
 *      description: Create a new person
 *      security: 
 *        - bearerAuth: []
 *      requestBody: 
 *        content: 
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required: 
 *                first_name, last_name, middle_name, phone_number, email, pass, role, addressId, date_born
 *              properties:
 *                first_name:
 *                  $ref: '#/components/schemas/Person/properties/first_name'
 *                last_name:
 *                  $ref: '#/components/schemas/Person/properties/last_name'
 *                middle_name: 
 *                  $ref: '#/components/schemas/Person/properties/middle_name'
 *                phone_number:
 *                  $ref: '#/components/schemas/Person/properties/phone_number'
 *                email:
 *                  $ref: '#/components/schemas/Person/properties/email'
 *                pass: 
 *                  $ref: '#/components/schemas/Person/properties/pass'
 *                role:
 *                  $ref: '#/components/schemas/Person/properties/role'
 *                addressId: 
 *                  $ref: '#/components/schemas/Person/properties/addressId'
 *                date_born: 
 *                  $ref: '#/components/schemas/Person/properties/date_born'
 *                photo:
 *                  type: file
 *                  description: profile_photo
 *                
 *                  
 *      responses: 
 *        201: 
 *          description: User successfully created
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  person:
 *                    $ref: '#/components/schemas/Person' 
 *                  message:
 *                    type: string
 *                    example: Person Successfully created
 * 
 *   
 */
router.post("/", upload.single('photo'), hasRoles(["Admin"]), personCreate, async (req, res) => {
  req.body.pass = await bcrypt.hash(req.body.pass, SALT_ROUND);
  if (req.file) {
    req.body.photo = await createFile(req.file);
  }
  const person = await Person.create(req.body);
  res.json(person).status(201);
});



router.get('/name/', async function (req, res) {
  if (req.query.name === undefined) return res.status(400).json({ message: 'Please input your name' });

  const words = req.query.name.split(/[\s.,-;]+/)
    .map(word => `%${word}%`)
    .filter(word => word.length > 2);

  const operator = words.length > 2 ? Sequelize.Op.and : Sequelize.Op.or
  const persons = await Person.findAll({
    include: Doctor,
    where: {
      '$doctor.person_id$': { [Sequelize.Op.not]: null },
      [operator]: {
        first_name: {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]: { [Sequelize.Op.any]: words }
          }
        },
        last_name: {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]: { [Sequelize.Op.any]: words }
          }
        },
        middle_name: {
          [Sequelize.Op.or]: {
            [Sequelize.Op.iLike]: { [Sequelize.Op.any]: words }
          }
        }
      }

    }
  });
  res.json(persons);

}

);

/**
*  @swagger
*  /api/v1/persons/time_slots:
*    get:
*      tags:
*      - "Person"
*      summary: Get person's time slots
*      description: Return time slots
*      security:
*        - bearerAuth: []
*      responses:
*        200:
*          description: Slots successfully found
*
*
*/
router.get('/time_slots', upload.none(), hasRoles(['User', 'Admin']), async (req, res) => {
  const currTime = moment().format('HH:mm');
  const currDate = moment().format('YYYY-MM-DD');

  const fetchTimeSlots = async (timeOperator, dateOperator) => await Schedule.findAll({
     include: [{model: TimeSlot, where: {
      personId: req.body.user.id,
      [Sequelize.Op.or]: [
        { date_visiting: { [dateOperator]: currDate } },
        {
          [Sequelize.Op.and]: [
            { date_visiting: { [Sequelize.Op.eq]: currDate } },
            { start_time: { [timeOperator]: currTime } }
          ]
        },
      ]
    }},
    { model: WorkPlace, include: [{model: Doctor, include:[Person]}, Hospital]} ]});

  const futureTimeSlots = await fetchTimeSlots(Sequelize.Op.gt, Sequelize.Op.gt);
  const pastTimeSlots = await fetchTimeSlots(Sequelize.Op.lte, Sequelize.Op.lt);

  return res.status(200).json({ future: timeSlotsHelper.scheduleToTimeslots(futureTimeSlots), 
    past: timeSlotsHelper.scheduleToTimeslots(pastTimeSlots)});
  
  });



/**
*  @swagger
*  /api/v1/persons/photo:
*    get:
*      tags:
*      - "Person"
*      summary: Get person'photo
*      description: Return photo
*      security: 
*        - bearerAuth: []                 
*      responses: 
*        200: 
*          description: Photo successfully found
*          content: 
*            application/json:
*              schema:
*                type: object
*                properties: 
*                  photo:
*                    type: string
*                    example: https://cloud.com/photo/123
* 
*   
*/
router.get("/photo", upload.none(), hasRoles(['Admin', 'User', 'Doctor']), async (req, res) => {
  return res.status(200).json(await Person.findByPk(req.body.user.id, { attributes: ['photo'] }));

});


/**
*  @swagger
*  /api/v1/persons/{id}:
*    get:
*      tags:
*      - "Person"
*      summary: Get person
*      description: Return an existed person
*      security: 
*        - bearerAuth: []
*      parameters: 
*      - in: path
*        name: id
*        required: true
*        schema: 
*          type: integer
*          minimum: 1
*        description: User's id
*        example: 1
*                  
*      responses: 
*        200: 
*          description: User successfully found
*          content: 
*            application/json:
*              schema:
*                $ref: '#/components/schemas/Person' 
*        400: 
*          description: No person with such id
* 
*   
*/
router.get("/:id", upload.single('photo'), hasRoles(["Admin", "User"]), async (req, res) => {
  const person = await Person.findByPk(req.params.id, { include: [Address] });
  person === null ? res.json({ message: `No person with id ${req.params.id}` }, 400) : res.json(person, 200);
});



/**
 *  @swagger
 *  /api/v1/persons/{id}:
 *    put:
 *      tags:
 *      - "Person"
 *      summary: Update an existed person
 *      description: Updates person by id
 *      security: 
 *        - bearerAuth: []
 *      parameters: 
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: integer
 *          minimum: 1
 *        description: User's id
 *        example: 1
 *      requestBody: 
 *        content: 
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                first_name:
 *                  $ref: '#/components/schemas/Person/properties/first_name'
 *                last_name:
 *                  $ref: '#/components/schemas/Person/properties/last_name'
 *                middle_name: 
 *                  $ref: '#/components/schemas/Person/properties/middle_name'
 *                phone_number:
 *                  $ref: '#/components/schemas/Person/properties/phone_number'
 *                email:
 *                  $ref: '#/components/schemas/Person/properties/email'
 *                addressId: 
 *                  $ref: '#/components/schemas/Person/properties/addressId'
 *                date_born: 
 *                  $ref: '#/components/schemas/Person/properties/date_born'
 *                photo:
 *                  type: file
 *                  description: profile_photo
 *                  
 *      responses: 
 *        201: 
 *          description: User successfully created
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  person:
 *                    $ref: '#/components/schemas/Person' 
 *                  message:
 *                    type: string
 *                    example: Person Successfully created
 * 
 *   
 */
router.put("/:id", upload.single('photo'), personUpdate, async (req, res) => {
  const person = await Person.findByPk(req.params.id);
  if (person === null) res.json({ message: `No person with id ${req.params.id}` }, 400);

  if (req.file) {
    if (person.photo !== '') removeFile(person.photo);
    req.body.photo = await createFile(req.file);
  }

  if (req.body.photo !== undefined && req.body.photo === null) {
    removeFile(person.photo);
  }

  const newPerson = await person.update(req.body);
  res.status(201).json(newPerson);
});

/**
 *  @swagger
 *  /api/v1/persons/{id}:
 *    delete:
 *      tags:
 *      - "Person"
 *      summary: Remove an existied person
 *      description: Remove person
 *      security: 
 *        - bearerAuth: []
 *      parameters: 
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: integer
 *          minimum: 1
 *        description: User's id
 *        example: 1
 *                  
 *      responses: 
 *        200: 
 *          description: User successfully removed
 *        400: 
 *          description: No person with such id
 * 
 *   
 */
router.delete("/:id", hasRoles(['Admin']), async (req, res) => {
  const person = await Person.findByPk(req.params.id);
  if (person === null) res.json({ message: `No person with id ${req.params.id}` }, 400);

  await person.destroy();
  res.json({ message: 'Successfully destroyed' }, 201);
});

router.get('/byAddressId/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.sendStatus(400);
  const persons = await Person.findAll({
    where: {
      addressId: req.params.id
    },
    include: [Address],
    order: [
      // will return `name`
      ['first_name'],
      // will return `username` DESC
      ['last_name'],
      ['middle_name'],
      ['date_born', 'DESC']
    ]
  });
  res.status(201).send(persons);
});


router.get('/', async (req, res) => {
  const persons = await Person.findAll({

    include: [Address]
  });
  res.status(201).send(persons).end();
}
)

module.exports = router;
