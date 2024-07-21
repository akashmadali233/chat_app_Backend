const dbConfig = require('../config/dbconfig');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/userModel')(sequelize, DataTypes);
db.Chat = require('../models/chatModel')(sequelize, DataTypes);
db.Message = require('../models/messageModel')(sequelize, DataTypes);

// Establish associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

  
module.exports = db;
