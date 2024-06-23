const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');
const upload = multer();
const { sequelize } = require('./models');

app.use(upload.array());

const userRoutes = require('./routers/userRoutes');
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;


sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
