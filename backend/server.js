const express = require('express');
const compression = require('compression');
const dotenv = require('dotenv');
const multer = require('multer');
const { sequelize } = require('./models'); // Assuming your models are in the ./models directory
const userRoutes = require('./routers/userRoutes'); // Adjust path as necessary
const chatRoutes = require('./routers/chatRoutes'); // Adjust path as necessary
const messageRoutes = require('./routers/messageRoutes');
const { Socket } = require('socket.io');
dotenv.config();

const app = express();
const upload = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
app.use(compression());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user.id == newMessageRecieved.sender.id) return;

      socket.in(user.id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});