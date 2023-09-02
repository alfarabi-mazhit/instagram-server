const sendEmail = require("../utils/sendMail");
const AuthCode = require("./models/AuthCode");
const User = require("./models/User");
const Role = require("./models/Role");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("./passport");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const Post = require("../post/models/Post");

const sendVerificationEmail = async (req, res) => {
  const authCode = await AuthCode.findOne({
    where: { email: req.body.email },
    order: [["valid_till", "DESC"]],
  });
  if (authCode && new Date(authCode.valid_till).getTime() > Date.now()) {
    res.status(200).send({ message: "Код авторизации уже был отправлен." });
  } else {
    const code = "AE" + Date.now();
    const obj = AuthCode.create({
      email: req.body.email,
      code,
      valid_till: Date.now() + 120000,
    });
    const { error, message } = await sendEmail(
      req.body.email,
      "Код авторизации в instagram: ",
      code
    );
    if (error?.length) {
      obj.destroy();
      res
        .status(300)
        .send({ error, message, page: "ДОПОЛНИТЬ СТРАНИЦЕЙ ПРОВЕРКИ КОДА" });
    } else res.status(200).end();
  }
};

const verifyCode = async (req, res) => {
  console.log(req.body);
  const authCode = await AuthCode.findOne({
    where: { email: req.body.email },
    order: [["valid_till", "DESC"]],
  });
  console.log(authCode);
  if (!authCode) {
    res.status(401).send({ message: "Неправильный код авторизации." });
  } else if (new Date(authCode.valid_till).getTime() < Date.now()) {
    res.status(401).send({ message: "Неправильный код авторизации." });
  } else if (authCode.code !== req.body.code) {
    res.status(401).send({ message: "Неправильный код авторизации." });
  } else {
    let user = await User.findOne({ where: { email: req.body.email } });
    const role = await Role.findOne({ where: { name: "user" } });
    if (user) {
      user.emailVerified = true;
      user.save();
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone || null,
          role: {
            id: role.id,
            name: role.name,
          },
        },
        jwtOptions.secretOrKey,
        {
          expiresIn: 30 * 24 * 60 * 60,
        }
      );
      res.status(200).send({ token });
    } else {
      res.status(401).send({ message: "Пользователь не найден." });
    }
  }
};

const signUp = async (req, res, next) => {
  try {
    const role = await Role.findOne({ where: { name: "user" } });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await User.create({
      email: req.body.email,
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      roleId: role.id,
    });
    next();
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
const signIn = async (req, res) => {
  if (
    (!req.body.phone || req.body.phone.trim() === "") &&
    (!req.body.username || req.body.username.trim() === "") &&
    (!req.body.email || req.body.email.trim() === "") &&
    (!req.body.password || req.body.password.trim() === "")
  ) {
    res.status(401).send("Bad Credentials");
  } else {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email !== undefined ? req.body.email : null },
          // { phone: req.body.phone !== undefined ? req.body.phone : null },
          {
            username: req.body.username !== undefined ? req.body.username : null,
          },
        ],
      },
    });
    if (!user) return res.status(401).send({ message: "Пользователь не найден." });
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log(isMatch, req.body.password, user.password);
    if (isMatch) {
      if (req.body.email !== undefined && !user.emailVerified) {
        sendVerificationEmail(req, res);
      } else {
        const role = await Role.findByPk(user.roleId);
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone || null,
            role: {
              id: role.id,
              name: role.name,
            },
          },
          jwtOptions.secretOrKey,
          {
            expiresIn: 30 * 24 * 60 * 60,
          }
        );
        res.status(200).send({ token });
      }
    } else {
      res.status(401).send({ message: "Неправильный пароль." });
    }
  }
};
const editUser = async (req, res) => {
  const updateFields = {};
  if (req.file) {
    if (req.user.photoUrl) {
      const oldPhotoPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        req.user.photoUrl.toString()
      );
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    updateFields.photoUrl = "/users/" + req.file.filename;
  }
  const allowedFields = [
    "username",
    "email",
    "phone",
    "name",
    "biography",
    "gender",
  ];

  for (const key of allowedFields) {
    if (req.body[key]) {
      updateFields[key] = req.body[key];
      if (key === "email") {
        updateFields["emailVerified"] = false;
      }
    }
  }

  await User.update(updateFields, {
    where: {
      id: req.user.id,
    },
  });
  res.status(200).end();
};
const findUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).send({ message: "Пользователь не найден." });
  } else {
    return res.status(200).send(user);
  }
};
const findUserByUsername = async (req, res) => {
  const user = await User.findOne({
    where: { username: req.params.username },
    include: [
      { model: Post, as: "createdPosts" },
      { model: Post, as: "likedPosts" },
    ],
  });
  if (!user) {
    return res.status(404).send({ message: "Пользователь не найден." });
  } else {
    user.password = null;
    return res.status(200).send(user);
  }
};
module.exports = {
  sendVerificationEmail,
  verifyCode,
  signUp,
  signIn,
  editUser,
  findUserByUsername,
  findUserById,
};
