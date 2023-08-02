const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const User = require("../auth/models/User");
const Story = require("./models/Story");
const StoryLike = require("./models/StoryLike");

const createStory = async (req, res) => {
  try {
    const story = await Story.create({
      userId: req.user.id,
      mediaUrl: "/users/" + req.user.id + "/stories/" + req.file.filename,
      location: req.body.location ? req.body.location : null,
    });
    res.status(200).send(story);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const getMyStories = async (req, res) => {
  const stories = await Story.findAll({
    where: { userId: req.user.id },
    include: [{ model: User, as: "likedUsers" }],
  });
  res.status(200).send(stories);
};

const getStoriesByUserId24h = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  const stories = await Story.findAll({
    where: {
      userId: req.params.id,
      createdAt: {
        [Op.gte]: twentyFourHoursAgo,
      },
    },
  });
  res.status(200).send(stories);
};
const deleteStoryById = async (req, res) => {
  const story = await Story.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!story) {
    return res.status(404).send("Story not found");
  }
  const filePath = path.join(__dirname, "..", "..", "..", "public", story.mediaUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  await story.destroy();
  res.status(200).end();
};
const storyLike = async (req, res) => {
  const story = await Story.findByPk(req.params.id);
  if (!story) {
    return res.status(400).send({ message: "Story not found" });
  }
  if (story.userId === req.user.id) {
    return res.status(400).send({ message: "You can not like your story" });
  }
  const [like, created] = await StoryLike.findOrCreate({
    where: {
      storyId: story.id,
      userId: req.user.id,
    },
  });
  if (created) {
    return res.status(200).send({ message: "Like added" });
  } else {
    await like.destroy();
    return res.status(200).send({ message: "Like removed" });
  }
};
module.exports = {
  createStory,
  getMyStories,
  getStoriesByUserId24h,
  deleteStoryById,
  storyLike,
};
