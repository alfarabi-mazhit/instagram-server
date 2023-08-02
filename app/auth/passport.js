const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require("./models/User");

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "s",
};

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    const user = await User.findByPk(jwtPayload.id);
    if (user) {
      // user.password = "";
      done(null, user);
    } else done(null, false);
  })
);
module.exports = {
  jwtOptions,
};
