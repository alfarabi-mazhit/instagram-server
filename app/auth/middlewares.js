const User = require("./models/User");
const Role = require("./models/Role");

const roleChecker = async (roleId, req, res, next) => {
  const role = await Role.findByPk(req.user.roleId);
  if (role && req.user.roleId >= roleId) {
    next();
  } else {
    res.status(403).send({ message: "Access denied!" });
  }
};

const isUser = async (req, res, next) => {
  roleChecker(1, req, res, next);
};

const isModerator = async (req, res, next) => {
  roleChecker(2, req, res, next);
};

const isAdmin = async (req, res, next) => {
  roleChecker(3, req, res, next);
};

const validateSignUp = async (req, res, next) => {
  let errors = {};
  if (!req.body.username || req.body.username.length === 0) {
    errors.username = "Поле Username обязательное";
  }
  if (!req.body.name || req.body.name.length === 0) {
    errors.name = "Поле Name обязательное";
  }
  if (!req.body.email || req.body.email.length === 0) {
    errors.email = "Поле Email обязательное";
  }
  if (!req.body.password || req.body.password.length === 0) {
    errors.password = "Поле Пароль обязательное";
  }
  if (!req.body.password2 || req.body.password2.length === 0) {
    errors.password2 = "Поле Подтвердить пароль обязательное";
  }
  if (req.body.password !== req.body.password2) {
    errors.password2 = "Пароли не совпадают";
  }
  let user;
  if (req.body.username) {
    user = await User.findOne({ where: { username: req.body.username } });
    if (user) {
      errors.username = "Пользователь с таким username уже зарегистрирован";
    }
  }
  if (req.body.email) {
    user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      errors.email = "Пользователь с таким email уже зарегистрирован";
    }
  }

  if (JSON.stringify(errors) !== JSON.stringify({})) res.status(400).send(errors);
  else next();
};

const validateEditUser = async (req, res, next) => {
  let errors = {};
  let user;
  if (req.body.username) {
    user = await User.findOne({ where: { username: req.body.username } });
    if (user) {
      errors.username = "Пользователь с таким username уже зарегистрирован";
    }
  }
  if (req.body.email) {
    user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      errors.email = "Пользователь с таким email уже зарегистрирован";
    }
  }
  if (JSON.stringify(errors) !== JSON.stringify({})) res.status(400).send(errors);
  else next();
};
module.exports = { isUser, isModerator, isAdmin, validateSignUp, validateEditUser };
