require('dotenv').config();
const express = require("express");
const router = express.Router();
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(passport.initialize());
require("./app/auth/passport");

router.get("/", (req, res) => {
  res.status(200).send({ message: "first page" });
});
app.use(require("./app/auth/routes"));
app.use(require("./app/post/routes"));
app.use(require("./app/story/routes"));
app.use(require("./app/comment/routes"));
app.use(require("./app/subscribe/routes"));

app.listen(3001, () => {
  console.log("server is listening at http://localhost:" + 3001);
});
