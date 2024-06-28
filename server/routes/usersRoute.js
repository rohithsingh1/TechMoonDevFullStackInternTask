const router = require("express").Router();
const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");



router.post("/login", async (req, res) => {
  try {
    console.log("nvkngkjhgkghgkfhbhjbfjfbhjbcvbnjbjc", req.body);
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
      const newUser = new User(req.body);

      await newUser.save();

      const jwtToken = jwt.sign(
        {
          userId: newUser._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1d",
        }
      );

     return res.status(200).send({
        message: "User logged in Successfully",
        success: true,
        data: newUser,
        token: jwtToken,
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (!passwordMatch) {
      return res.send({
        message: "Incorrect email or password",
        success: false,
        data: null,
        token: null,
      });
    }
    const jwtToken = jwt.sign(
      {
        userId: userExists._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).send({
      message: "User logged in Successfully",
      success: true,
      data: userExists,
      token: jwtToken,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
      token: null,
    });
  }
});


router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.send({
        message: "User does not exist",
        success: false,
        data: null,
        token: null,
      });
    } else {
      return res.send({
        message: "User fetched successfully",
        success: true,
        data: user,
        token: req.body.jwtToken,
      });
    }
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
      token: null,
    });
  }
});


module.exports = router;