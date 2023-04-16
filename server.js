const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRoutes);

connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`LISTENING TO PORT ${PORT}`);
});
