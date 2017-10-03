const path = require("path");

// connecting, configurig and executing Express
const express = require("express");
const config = require('./config');
const app = express();

// connecting mongoose for using MongoDB
const mongoose = require("mongoose");

// connecting parsers to pars requests
const bodyParser = require("body-parser");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const upload = multer({ dest: 'uploads/' });

// connecting passport and express-session to indetify users
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

// connecting cors to use different origins requests fo server
const cors = require('cors');

// connecting schemas for usinf databases
const userSchema = require("../schemas/users");
const moviesSchema = require("../schemas/movies");
const commentsSchema = require("../schemas/comments");
const likesSchema = require("../schemas/likes");

// connecting models based on mentioned above schemas
const User = mongoose.model("User", userSchema);
const Movie = mongoose.model("Movie", moviesSchema);
const Comment = mongoose.model("Comment", commentsSchema);
const Like = mongoose.model("Like", likesSchema);

// using mongoose to deal with database
mongoose.connect(config.mooviezDB, {
  useMongoClient: true
});

mongoose.connection.on("open", () => {
  console.log("MongoDB connected on port 48888");
});


// using parsers for requests
//app.use(cors());
app.use(express.static(__dirname + '/../../public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.any());
app.use(cookieParser());
app.use(expressSession({ secret: "mirosh2" }));
app.use(passport.initialize());
app.use(passport.session());


// showing to console request URL for every request to server
app.use((req, res, next) => {
  console.log("URL:", req.url);
  next();
});



passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.login);
});

passport.deserializeUser((login, done) => {
  User.findOne({ login: login }, (err, user) => {
    console.log(user);
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  { usernameField: 'login',
  passwordField: 'password'},
  (login, password, done) => {
  User.findOne({ login: login }, (err, user) => {
    if(err)
      return done(err);

    if(!user)
      return done(null, false, { message: "User was not found" });

    if(!user.password === password)
      return done(null, false, { message: "Incorrect password" });

    return done(null, user);
  });
}));

app.get("/*", (req, res, next) => {
  
  const { url, user } = req;

  console.log(user);
  console.log(url);

  /*if(!user && url !== "/" && url !== "/signup")
    return res.redirect("/");

  if(user &&  url === "/signup")
    return res.redirect("/");*/

  next();
});

// connecting routes form modules
require("./login")(app, User, Comment, Movie, Like);
require("./logout")(app, User);
require("./movies")(app, Movie, Like, Comment);
require("./movie:id")(app, Movie);
require("./likes:id")(app, Like);
require("./comments:id")(app, Comment, User);
require("./comments")(app, Comment, Movie, User);
require("./signup")(app, User);
require("./profile")(app, User);

// routing for entering point (index.html) with react-app
app
  .route('/')
  .get((req, res) => {
    res.sendFile(__dirname+'/../../pubilc/index.html');
  })


// running server on port from config
app.listen(config.port, () => {
  console.log(`Express is listening on port ${config.port}`);
});