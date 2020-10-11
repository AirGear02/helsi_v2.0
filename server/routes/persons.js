const express = require('express');
const Person = require('../models/Person');
const Address = require('../models/Address');
const { Sequelize } = require('sequelize');
const router = express.Router();

router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
         
     //const id = req.body.id;
    const first_name = req.body.first_name;
    const last_name=req.body.last_name;
    const middle_name=req.body.middle_name;
    const date_born=req.body.date_born;
    const phone_number=req.body.phone_number;    
    const email=req.body.email;
    const pass=req.body.pass;
    const role=req.body.role;
    const addressId=req.body.addressId;
    Person.create({ //id:id,
                    first_name: first_name,
                     last_name:last_name,
                     middle_name:middle_name,
                     date_born:date_born,
                     phone_number:phone_number,
                     email:email,
                     pass:pass,
                     role:role,
                     addressId:addressId,
                    }       
                     ).then((result)=>{                    
                      res.status(201).send(res.json(result));
    }).catch(err=>console.log(err));
});
router.get( "/id/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    Person.findByPk(req.params.id,{include: [Address]}).then( (result) => res.json(result))
 } );

router.put( "/:id", (req, res) =>
    Person.update({
        addressId: req.body.addressId
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
  );
router.delete("/:id",(req,res)=>{
    
    Person.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
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
  let name=req.query.filter?req.query.filter.trim():'';
  
 
  
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
      
      
      //   first_name:{
          
        
      //     // [Sequelize.Op.and]:{
      //       [Sequelize.Op.iLike]: `%${f_name}%` ,
      //       [Sequelize.Op.iLike]: `%${l_name}%`,
      //       [Sequelize.Op.iLike]: `%${m_name}%`,
  
      //     //}
      //   }
      //   ,
      //   last_name:{
      //     [Sequelize.Op.or]:{
      //       [Sequelize.Op.iLike]: `%${f_name}%`,
      //       [Sequelize.Op.iLike]: `%${l_name}%`,
      //       [Sequelize.Op.iLike]: `%${m_name}%`,
  
      //     }
      //   },
      //   middle_name:{
      //     [Sequelize.Op.or]:{
      //       [Sequelize.Op.iLike]: `%${f_name}%`,
      //       [Sequelize.Op.iLike]: `%${l_name}%`,
      //       [Sequelize.Op.iLike]: `%${m_name}%`,
  
      //     }
      //   }
      // }