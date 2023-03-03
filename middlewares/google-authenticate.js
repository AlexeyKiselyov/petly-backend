const passport = require("passport");
const { Strategy } = require("passport-google-oauth2");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const gravatar = require("gravatar");

const { User } = require("../models/user");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL } = process.env;

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${FRONTEND_URL}/api/v1/auth/google/callback`,
  passReqToCallback: true,
};

const googleCalback = async (req, accessToken, refreshToken, profile, done) => {
  try {
    const { email, displayName } = profile;
    const user = await User.findOne({ email });
    if (user) {
      return done(null, user);
    }
    const password = await bcrypt.hash(nanoid(), 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      email,
      password,
      name: displayName.slice(0, 19),
      avatarURL,
    });
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy = new Strategy(googleParams, googleCalback);

passport.use("google", googleStrategy);

module.exports = passport;
