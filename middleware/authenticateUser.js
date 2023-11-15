const jwtToken = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decode = jwtToken.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (err) {
      return res.send({
        status: false,
        message: "Not Authorize, Token Failed",
      });
    }
  }

  if (!token) {
    return res.send({ status: false, message: "Not Authorize, No Token" });
  }
});

module.exports = { protect };
