const express = require("express");
const router = express.Router();
const passport = require("passport");
const { subscribe, subscribesTo, subscribesBy, suggest } = require("./controllers");

// router.post(
//   "/api/subscribe/:id",
//   passport.authenticate("jwt", { session: false }),
//   subscribeById
// );

router.post(
  "/api/subscribe/:username",
  passport.authenticate("jwt", { session: false }),
  subscribe
);
router.get(
  "/api/subscribers/:username",
  // passport.authenticate("jwt", { session: false }),
  subscribesTo
);
router.get(
  "/api/subscriptions/:username",
  // passport.authenticate("jwt", { session: false }),
  subscribesBy
);
router.get(
  "/api/subscribe/suggest",
  passport.authenticate("jwt", { session: false }),
  suggest
);

module.exports = router;
