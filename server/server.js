const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const multer = require('multer');




require('dotenv').config();

const app = express();
app.use(express.json())
app.use(cors());




app.use('/jobs', require('./routes/jobs'));
app.use('/addresses', require('./routes/addresses'));
app.use('/persons', require('./routes/persons'));
app.use('/doctors', require('./routes/doctors'));
app.use('/work_places', require('./routes/workPlaces'));

app.use('/hospitals', require('./routes/hospitals'));
app.use('/schedules', require('./routes/schedules'));
app.use('/time_slots', require('./routes/timeSlots'));
app.use('/auth', require('./routes/auth'));



const PORT = process.env.PORT || 5000;

const db = require('./config/database');

//sequelize.sync({force:true}) 

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Helsi API',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        
    },
    apis: ['./routes/*.js', './models/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

db.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error));


app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));