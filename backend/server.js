const express = require('express');
const compression = require('compression');
const dotenv = require('dotenv');
const multer = require('multer');
const { sequelize } = require('./models');
const userRoutes = require('./routers/userRoutes');
dotenv.config();

const app = express();
const upload = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
app.use(compression());


app.use('/api', userRoutes);

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
