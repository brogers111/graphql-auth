const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = mongoose.model("user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      console.log(`Authenticating: ${email}`);

      const user = await User.findOne({ email });

      if (!user) {
        console.log("User not found.");
        return done(null, false, { message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log("Password incorrect.");
        return done(null, false, { message: "Invalid credentials." });
      }

      console.log("Login successful!");
      return done(null, user);
    }
  )
);

function signup({ email, password, req }) {
  const user = new User({ email, password });
  if (!email || !password) {
    throw new Error("You must provide an email and password.");
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("Email in use");
      }
      return user.save();
    })
    .then((user) => {
      return new Promise((resolve, reject) => {
        req.logIn(user, (err) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });
    });
}

function login({ email, password, req }) {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject(new Error("Invalid credentials."));
      }

      req.login(user, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(user);
      });
    })(req);
  });
}

module.exports = { signup, login };
