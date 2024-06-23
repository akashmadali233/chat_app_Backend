const dbConfig = require('../config/dbconfig');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Define your models here
db.users = require('../models/userModel')(sequelize, DataTypes);
db.messages = require('../models/mesaageModel')(sequelize, DataTypes);
db.chats = require('../models/chatModel')(sequelize, DataTypes);


module.exports = db;
