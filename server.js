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

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);

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
