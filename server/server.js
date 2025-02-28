const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const models = require("./models");
const schema = require("./schema/schema");
const passportConfig = require("./services/auth");

const app = express();

const MONGO_URI = "mongodb://localhost:27017/graphql-auth";
if (!MONGO_URI) {
  throw new Error("You must provide a MongoDB Compass URI");
}

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "aaabbbccc",
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      autoReconnect: true,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const webpackMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("../webpack.config.js");
app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;
