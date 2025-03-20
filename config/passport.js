const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { getDb } = require("../db/connect");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? process.env.GOOGLE_CALLBACK_URL_PROD
          : process.env.GOOGLE_CALLBACK_URL_LOCAL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDb();
        const usersCollection = db.collection("users");

        let user = await usersCollection.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          const newUser = {
            email: profile.emails[0].value,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            role: "user",
            createdAt: new Date(),
          };
          const result = await usersCollection.insertOne(newUser);
          user = { ...newUser, _id: result.insertedId };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
