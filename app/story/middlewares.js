const Story = require("./models/Story");

const validateStory = (req, res, next) => {
  let errors = {};
  if (!req.file) {
    errors.media = "Поле Медиа обязательное";
  }
  if (JSON.stringify(errors) !== JSON.stringify({})) res.status(400).send(errors);
  else next();
};

const isAuthorOfStory = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const story = await Story.findByPk(id);
  if (!story) res.status(400).send({ message: "Story with that id does not exist" });
  else if (req.user.id === story.userId) next();
  else res.status(403).send({ message: "Access Forbidden" });
};

module.exports = { validateStory, isAuthorOfStory };
