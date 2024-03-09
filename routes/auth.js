const express = require("express");
const User = require("../models/User");

const router = express.Router();

const { body, validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JET_SECRET = process.env.JET_SECRET;

// get all user
router.get("/getuser", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
});

// cerating the user with secured password and assining the user with web token
router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("location", "enter a valid location").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password is of more than 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      const { name, location, email } = req.body;
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // checking whether the user already exist or not
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success,
          error: "user with this mail already exist sign up with new User",
        });
      }

      // creating the user
      user = await User.create({ name, location, email, password: secPass });

      // creating the token
      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JET_SECRET);
      console.log("signup_authtoken", authToken);
      success = true;
      res.status(200).json({ success, authToken });
    } catch (error) {
      console.log(error.message);
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // if email is not valid return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let success = false;
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please login with correct credential" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res
          .status(400)
          .json({ success, error: "Please login with correct credential" });
      }
      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JET_SECRET);
      success = true;
      console.log({ success, authToken });
      res.json({ success, authToken });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

// get all user
router.post("/logeduser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("internal server error");
  }
});

module.exports = router;
