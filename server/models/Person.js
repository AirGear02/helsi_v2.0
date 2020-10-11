const Sequelize = require('sequelize');
const db = require('../config/database');
const Address = require('./Address')

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
    addressId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    role: {
        type: Sequelize.ENUM('User', 'Admin', 'Doctor'),
    }
    
}, { timestamps: false, tableName: 'persons', underscored: true});


Person.belongsTo(Address);
Address.hasMany(Person);


module.exports = Person;