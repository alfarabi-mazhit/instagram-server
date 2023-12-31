const User = require("../auth/models/User");
const Subscriber = require("./Subscriber");

const subscribeById = async (req, res) => {
  const targetUser = await User.findByPk(req.params.id);
  if (!targetUser) {
    return res.status(404).send({ message: "targetUser not found" });
  }
  const [sub, created] = await Subscriber.findOrCreate({
    where: {
      targetUserId: targetUser.id,
      subUserId: req.user.id,
    },
  });
  if (created) {
    return res.status(200).send({ message: "Sub added" });
  } else {
    await sub.destroy();
    return res.status(200).send({ message: "Sub removed" });
  }
};

const subscribe = async (req, res) => {
  const targetUser = await User.findOne({
    where: { username: req.params.username },
  });
  if (!targetUser) {
    return res.status(404).send({ message: "targetUser not found" });
  }
  if (targetUser.id === req.user.id) {
    return res.status(404).send({ message: "You can not subscribe to yourself" });
  }
  const [sub, created] = await Subscriber.findOrCreate({
    where: {
      targetUserId: targetUser.id,
      subUserId: req.user.id,
    },
  });
  if (created) {
    return res.status(200).send({ message: "Sub added" });
  } else {
    await sub.destroy();
    return res.status(200).send({ message: "Sub removed" });
  }
};

const subscribesTo = async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (!user) {
    return res.status(404).send({ message: "user not found" });
  }
  const subscribers = await Subscriber.findAll({
    where: { targetUserId: user.id },
  });
  res.status(200).send(subscribers);
};

const subscribesBy = async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (!user) {
    return res.status(404).send({ message: "user not found" });
  }
  const subscribers = await Subscriber.findAll({
    where: { subUserId: user.id },
  });
  res.status(200).send(subscribers);
};

const suggest = async (req, res) => {
  const users = await Subscriber.findAll({
    where: {
      subUserId: req.user.id,
    },
  });
  if (users.length === 0) {
    return res.status(200).send([]);
  }
  const userIds = users.map((subscription) => subscription.targetUserId);
  const allSubscriptions = await Subscriber.findAll({
    where: {
      subUserId: userIds,
    },
    order: [["createdAt", "DESC"]],
  });
  const lastFiveSubsIds = allSubscriptions
    .slice(0, 5)
    .map((subscription) => subscription.targetUserId);
  const sugUsers = await User.findAll({
    where: { id: lastFiveSubsIds },
    attributes: ["id", "photoUrl", "username"],
  });
  res.status(200).send(sugUsers);
};

module.exports = {
  subscribeById,
  subscribe,
  subscribesTo,
  subscribesBy,
  suggest,
};
