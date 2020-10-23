const Sequelize = require('sequelize');
const db = require('../config/database');
const Address = require('./Address')

/**
 *  @swagger
 *  components:
 *      schemas:
 *           Person:
 *              type: object
 *              properties:
 *                   id:
 *                       type: integer
 *                       format: int64
 *                       readOnly: true
 *                   first_name: 
 *                       type: string
 *                       example: John
 *                   last_name:
 *                      type: string
 *                      example: Doe
 *                   middle_name: 
 *                      type: string
 *                      example: John
 *                   phone_number:
 *                      type: string
 *                      example: 0990619648
 *                   email:
 *                      type: string
 *                      example: user@mail.com
 *                   pass: 
 *                      type: string
 *                      example: user1234
 *                   role:
 *                      type: string
 *                      enum: [User, Admin, Doctor]
 *                      example: User
 *                   addressId: 
 *                      type: int
 *                      description: Foreign key to address
 *                      example: 1
*                   date_born: 
 *                      type: date
 *                      example: 1998-05-10
 */
const Person = db.define('person', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    first_name: {    
        type: Sequelize.STRING, 
        allowNull: false
    },
    last_name: {    
        type: Sequelize.STRING, 
        allowNull: false
    },
    middle_name: {    
        type: Sequelize.STRING, 
    },
    date_born: {
        type: Sequelize.DATEONLY
    },
    phone_number: {    
        type: Sequelize.STRING, 
    },
    email: {
        type: Sequelize.STRING,    
    },
    pass: {
        type: Sequelize.STRING,
        allowNull: false 
    },
    photo: {
        type: Sequelize.STRING
    },

    role: {
        type: Sequelize.ENUM('User', 'Admin', 'Doctor'),
    }
    
}, { timestamps: false, tableName: 'persons', underscored: true});


Person.belongsTo(Address);
Address.hasMany(Person);


module.exports = Person;