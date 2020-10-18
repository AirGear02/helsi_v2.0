const express = require('express');

const { Sequelize } = require('sequelize');
const hasRoles = require('../middleware/hasRoles');
const hasRolesOrAccOwner = require('../middleware/hasRolesOrAccountOwner');

const personCreate = require('../validation/person/personCreate');
const personUpdate = require('../validation/person/personUpdate');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const bcrypt = require('bcrypt');
const Person = require('../models/Person');
const Address = require('../models/Address');
const { verify } = require('jsonwebtoken');

const SALT_ROUND = 10;

/**
 *  @swagger
 *  /persons/:
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
router.post("/", upload.none(), hasRoles(["Admin"]),async (req, res) =>  {      
    const value = await personCreate(req, res);
    value.pass = await bcrypt.hash(value.pass, SALT_ROUND);
    const person = await Person.create(value);
    res.json(person).status(201);
});


/**
 *  @swagger
 *  /persons/{id}:
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
router.get( "/:id", upload.none(), hasRoles(["Admin", "User"]), async (req, res) => {
    const person = await Person.findByPk(req.params.id,{include: [Address]});
    person === null ? res.json({message: `No person with id ${req.params.id}`}, 400) : res.json(person, 200);
 });


/**
 *  @swagger
 *  /persons/{id}:
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
router.put( "/:id", upload.none(), hasRolesOrAccOwner(['Admin']), async (req, res) => {
    const person = await Person.findByPk(req.params.id);
    if(person === null) res.json({message: `No person with id ${req.params.id}`}, 400);

    const value = await personUpdate(req, res);
    const newPerson = await person.update(value);
    res.json(newPerson, 201);
});

/**
 *  @swagger
 *  /persons/{id}:
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
router.delete("/:id", hasRoles(['Admin']), async (req,res) => {
    const person = await Person.findByPk(req.params.id);
    if(person === null) res.json({message: `No person with id ${req.params.id}`}, 400);

    await person.destroy();
    res.json({message: 'Successfully destroyed'}, 201);
});

router.get('/byAddressId/:id', async (req, res) => {
  const id=req.params.id;
  if(!id) return res.sendStatus(400);
  const persons = await Person.findAll({
      where:{
        addressId:req.params.id
      },   
      include: [Address],
      order: [
        // will return `name`
        ['first_name'],
        // will return `username` DESC
        ['last_name'],
        ['middle_name'],
        ['date_born','DESC']
    ]
  });
  res.status(201).send(persons);
});

router.get('/byFLM/', async function (req, res){
  let name=req.query.filter ? req.query.filter.trim():'';
  
 
  
  const persons=await Person.findAll({
    where:{
      [Sequelize.Op.or]:{
        first_name:{    
        
          
            [Sequelize.Op.iLike]: `%${name}%`,
           
  
          
        },
        last_name:{
         
          [Sequelize.Op.iLike]: `%${name}%`,
  
          
        },
        middle_name:{
          
          [Sequelize.Op.iLike]: `%${name}%`,
  
          
        }
      }
     
        }
        
    }
  );
  
  res.status(201).send(persons);
});
  

// router.get('/byFLM1', async function (req, res){
//   let f_name='', l_name='',m_name='';
//   if(req.query.f_name){
//       f_name='%'+(req.query.f_name)+'%';
//   }
//   if(req.query.l_name){
//       l_name='%'+req.query.l_name+'%';
//   }
//   if(req.query.m_name){
//       m_name='%'+req.query.m_name+'%';
//   }  
//   if(f_name==''&&l_name==''&&m_name==""){
//       f_name='%';
//   }
  
//   const persons=await Person.findAll({
//     where:{
//       [Sequelize.Op.or]:{
//         first_name:{
          
        
//           [Sequelize.Op.or]:{
//             [Sequelize.Op.iLike]: f_name,
//             [Sequelize.Op.iLike]: l_name,
//             [Sequelize.Op.iLike]: m_name,
  
//           }
//         },
//         last_name:{
//           [Sequelize.Op.or]:{
//             [Sequelize.Op.iLike]: f_name,
//             [Sequelize.Op.iLike]: l_name,
//             [Sequelize.Op.iLike]: m_name,
  
//           }
//         },
//         middle_name:{
//           [Sequelize.Op.or]:{
//             [Sequelize.Op.iLike]: f_name,
//             [Sequelize.Op.iLike]: l_name,
//             [Sequelize.Op.iLike]: m_name,
  
//           }
//         }
//       }
     
//         }
        
//     },
//   );
  
//   res.status(201).send(persons);
// });

// router.get('/byFLM1/', async function (req, res){
//   let values=req.query.filter.split(' ');
//   console.log(values.length); 
//   let f_name='', l_name='',m_name='';
//   if(values.length==0){
//     f_name='%'
//   }
//   else if(values.length==1){
//     f_name=values[0].trim();
//   }
//   else  if(values.length==2){ 
//      f_name=values[0].trim();    
//       l_name=values[1].trim();
//     }
//   else{  
//       f_name=values[0].trim();   
//       l_name=values[1].trim();
//       m_name=values[2].trim();
//     }  
//   console.log(f_name,l_name,m_name);
 
//   const persons=await Person.findAll({
//     where:{
//       [Sequelize.Op.or]:{
//         first_name:{
          
        
//           [Sequelize.Op.or]:{
//             [Sequelize.Op.iLike]: `%${f_name}%`,
//             [Sequelize.Op.iLike]: `%${l_name}%`,
//             [Sequelize.Op.iLike]: `%${m_name}%`,
  
//           }
//         },
//         last_name:{
//           [Sequelize.Op.or]:{
//             [Sequelize.Op.iLike]: `%${f_name}%`,
//             [Sequelize.Op.iLike]: `%${l_name}%`,
//             [Sequelize.Op.iLike]: `%${m_name}%`,
  
//           }
//         },
//         middle_name:{
//           [Sequelize.Op.or]:{
//             [Sequelize.Op.iLike]: `%${f_name}%`,
//             [Sequelize.Op.iLike]: `%${l_name}%`,
//             [Sequelize.Op.iLike]: `%${m_name}%`,
  
//           }
//         }
//       }
     
//         }
        
//     },
//   );
  
//   res.status(201).send(persons);
// });
router.get('/byFLM1/', async function (req, res){
  
  let values=req.query.filter?req.query.filter.split(' '):[];
  console.log(values.length); 
  let f_name='%', l_name='%',m_name='%';
  if(values.length!=0){
    if(values.length==1){
      f_name='%'+values[0].trim()+'%';
      

    }
    else  if(values.length==2){ 
       f_name='%'+values[0].trim()+'%';    
        l_name='%'+values[1].trim()+'%';
      }
    else{  
        f_name='%'+values[0].trim()+'%';   
        l_name='%'+values[1].trim()+'%';
        m_name='%'+values[2].trim()+'%';
      }  
  }
  
  console.log(f_name,l_name,m_name);
 
  const persons=await Person.findAll({
    where:{
     
      [Sequelize.Op.and]:[
              {first_name:{[Sequelize.Op.iLike]: `${f_name}`}},
              {last_name:{[Sequelize.Op.iLike]: `${l_name}`}},        
              {middle_name:{[Sequelize.Op.iLike]: `${m_name}`}},  
          ]
        }
      });
      res.status(201).send(persons);
}
  
    
  );
    
  router.get('/', async (req, res) => {
    const persons = await Person.findAll({
        
        include: [Address]
    });
    res.status(201).send(persons);
  }
)
    
    module.exports = router;
      