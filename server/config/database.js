const Sequelize = require('sequelize');

const HOST_ADDRESS = process.env.db_host;
const DB_NAME = process.env.db_name;
const USER_NAME = process.env.user_name;
const USER_PASSWORD = process.env.user_password;

module.exports = new Sequelize(DB_NAME, USER_NAME, USER_PASSWORD, {
    host: HOST_ADDRESS,
    dialect: 'postgres'
});
