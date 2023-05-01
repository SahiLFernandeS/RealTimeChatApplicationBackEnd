const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
// const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`LISTENING TO PORT ${PORT}`);
});
