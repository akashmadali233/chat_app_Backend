const express = require('express');
const compression = require('compression');
const dotenv = require('dotenv');
const multer = require('multer');
const { sequelize } = require('./models'); // Assuming your models are in the ./models directory
const userRoutes = require('./routers/userRoutes'); // Adjust path as necessary
const chatRoutes = require('./routers/chatRoutes'); // Adjust path as necessary
dotenv.config();

const app = express();
const upload = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
app.use(compression());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
