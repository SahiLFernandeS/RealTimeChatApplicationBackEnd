const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
// const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const Message = require("./models/messageModel");
const Chat = require("./models/chatModel");
const jwtToken = require("jsonwebtoken");
const User = require("./models/userModel");

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);

  async function authenticateUser() {
    let token;

    if (socket.handshake.headers.token) {
      try {
        token = socket.handshake.headers.token;

        var decode = jwtToken.verify(token, process.env.JWT_SECRET);
        // console.log("decode-------->", decode);
        var user = await User.findById(decode.id).select("-password");
        // return user;
        return { status: true, data: user, message: "Access Granted" };
      } catch (err) {
        console.log("error------->", err);
        return { status: false, data: {}, message: "Not Authorize, No Token" };
      }
    }

    if (!token) {
      return { status: false, data: {}, message: "Not Authorize, No Token" };
    }
  }

  // authenticateUser().then((res) => console.log("res----->", res));

  socket.on("joinRoom", async (data) => {
    try {
      // console.log("data------->", data);
      var { chatId } = data;
      if (!chatId) return socket.emit("error", "please provide required field");
      socket.join(chatId);
    } catch (error) {
      console.log("error------>", error);
      socket.emit("error", error.message);
    }
  });

  socket.on("sendMessage", (newMessageReceived) => {
    try {
      // var newMessageReceived = {
      //   sender: {
      //     _id: "65ab522173365b499339f127",
      //     name: "Sahil Fernandes",
      //     email: "fernandessahil42@gmail.com",
      //   },
      //   content: "Hey",
      //   chat: {
      //     _id: "65ab525473365b499339f12f",
      //     chatName: "sender",
      //     isGroupChat: false,
      //     users: [
      //       {
      //         _id: "65ab522173365b499339f127",
      //         name: "Sahil Fernandes",
      //         email: "fernandessahil42@gmail.com",
      //       },
      //       {
      //         _id: "643c200802d49bc0d5faccbb",
      //         name: "Guest",
      //         email: "guest@sahil.com",
      //       },
      //     ],
      //     createdAt: "2024-01-20T04:55:48.003Z",
      //     updatedAt: "2024-01-20T13:03:34.547Z",
      //     __v: 0,
      //     lastMessage: "65abc4a5f5c38305512b3e87",
      //   },
      //   _id: "65ad442ae2732413007d490d",
      //   createdAt: "2024-01-21T16:19:54.235Z",
      //   updatedAt: "2024-01-21T16:19:54.235Z",
      //   __v: 0,
      // };

      // console.log("newMessageReceived------->", newMessageReceived);

      var chat = newMessageReceived.chat;

      if (!chat.users) return console.log("chat.users not defined");

      chat.users.forEach((user) => {
        // console.log("user------>", user);
        if (user._id === newMessageReceived.sender._id) {
          return;
        }
        // console.log("hello");
        io.to(chat._id).emit("newMessage", newMessageReceived);
      });
    } catch (error) {
      console.log("error------>", error);
      socket.emit("error", error.message);
    }
  });

  // console.log("socket.rooms--------->", socket.rooms);

  socket.on("disconnect", () => {
    console.log("User Disconnect: ", socket.id);
  });
});

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("*", (req, res, next) => {
  console.log("request------->", req.body);
  next();
});

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

connectDB();
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`LISTENING TO PORT ${PORT}`);
});
