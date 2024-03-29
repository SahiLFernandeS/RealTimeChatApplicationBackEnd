const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed To Create User");
  }
});

const userLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({
        status: false,
        message: "Please Enter All The Fields",
      });
    }

    const user = await User.findOne({ email });

    if (user && user.password == password) {
      return res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    return res.send({ status: false, message: "Invalid Email or Password" });
  } catch (error) {
    return res.send({ status: false, message: "Internal Server Error" });
  }
});

// api/user?search="...."
const allUsers = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select("-password");

    return res.send(users);
  } catch (error) {
    return res.send({ status: false, message: "Internal Server Error" });
  }
});
module.exports = { userRegister, userLogin, allUsers };
