const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10).then((hashedPassword) => {
    const user = new User({
      email,
      password: hashedPassword,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({ message: "User Created.", result: result });
      })
      .catch((err) => {
        res.status(500).json({ message: "Invalid Credentials!" });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Auth Failed." });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, fetchedUser.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ message: "Auth Failed." });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res
        .status(200)
        .json({ token: token, expiresIn: 3600, userId: fetchedUser._id });
    })
    .catch((err) => {
      // console.log(err);

      return res.status(401).json({ message: "Invalid Credentials!" });
    });
};
