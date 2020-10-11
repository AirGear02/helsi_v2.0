const express = require('express');
const Doctor = require('../models/Doctor');
const Person = require('../models/Person');
const JobTiltle = require('../models/JobTitle')

const router = express.Router();


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
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    Doctor.findByPk(req.params.id,{include: [Person, JobTiltle]}).then( (result) => res.json(result))
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
  res.status(201).send(doctors);
});

module.exports = router;