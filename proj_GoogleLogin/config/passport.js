const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user_model");
//passport提供的與google連線的方式，稱之為googleStrategy
//https://github.com/jaredhanson/passport-google-oauth2
//這邊有提供寫法

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
      //這邊的callbackURL指的是GOOGLE授權之後，要導回的route
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback
      console.log(profile); //log出來的東西就是google 回傳的profile資訊
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          console.log("User exist");
          done(null, foundUser);
        } else {
          new User({
            name: profile.displayname,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New User created.");
              done(null, newUser);
            });
        }
      });
    }
  )
);
