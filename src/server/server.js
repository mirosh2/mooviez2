const express = require("express");
const app = express();
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const multer = require("multer");

const passport = require("passport");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local").Strategy;
const cors = require('cors');
const expressSession = require("express-session");

const userSchema = require("../schemas/users");
const moviesSchema = require("../schemas/movies");
const commentsSchema = require("../schemas/comments");
const likesSchema = require("../schemas/likes");

const User = mongoose.model("User", userSchema);
const Movie = mongoose.model("Movie", moviesSchema);
const Comment = mongoose.model("Comment", commentsSchema);
const Like = mongoose.model("Like", likesSchema);

const upload = multer({ dest: 'uploads/' });

mongoose.connect("mongodb://localhost:48888/mooviez", {
  useMongoClient: true
});

mongoose.connection.on("open", () => {
  console.log("MongoDB connected on port 48888");
  let userId, movieId;
  /*User.create({
    login: "mirosh",
    password: "alex",
  }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  })
  console.log("regular user was created");*/

 /* Movie.create({
    title: "Movie2",
    description: "Some description about Movie2",
  }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
    console.log("Movie was created");
  })*/
  

  /*User.find({ login: "mirosh" }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(data);
    userId = data[0]._id;

    console.log("userID", userId);

    Movie.find({ title: "Movie1"}, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      
      movieId = data[0]._id;

      console.log("movieId", movieId);
    
      Like.create({ userID: userId, movieID: movieId }, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log(data);
        console.log("Like from mirosh for movie1 was created");
      })
  
    })
  })*/
  //movieID = 59c64e875acf0b1b2f62db40
  //mirosh _id = 59c4c29766e49314f3053175
});

app.use(cors());
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.any());
app.use(cookieParser());
app.use(expressSession({ secret: "mirosh2" }));
//app.use(passport.initialize());
//app.use(passport.session());

app.use((req, res, next) => {
  console.log("URL:", req.url);
  next();
});

/*passport.serializeUser((user, done) => {
  done(null, user.login);
});

passport.deserializeUser((username, done) => {
  User.findOne({ login }, done);
});


passport.use(new LocalStrategy((login, password, done) => {
  User.findOne({ login }, (err, user) => {
    if(err)
      return done(err);

    if(!user)
      return done(null, false, { message: "User was not found" });

    if(!user.password === password)
      return done(null, false, { message: "Incorrect password" });

    return done(null, user);
  });
}));*/

app
  .route("/login")
  .post((req, res) => {
    
    const { login, password } = req.body;
    
    let lastLogin, currentUserID, isAdmin;

    if ((!login || !password)||((login.trim() === "")||(password.trim()==="")))
      res.status(400).send({ message: "Bad request" });
    
    User.findOne({ login }, (err, data) => {
      if (err)
        res.status(500).send(err);

      if (!data)
        res.status(200).send({ message: "Wrong username" })

      else if (data.password !== password )
             res.status(200).send({ message: "Wrong password" })
           
           else {
            
            isAdmin = data.isAdmin;
            lastLogin = data.lastLogin;
            currentUserID = data._id;

            const newMovies = new Promise((res, rej) => {
              Movie.find({ date: { $gt: lastLogin }}, (err, data) => {
                if(err) return rej(err);

                res(data);
              });
            });

            const userComments = new Promise((res, rej) => {
              Comment.find({ userID: currentUserID }, (err, data) => {
                if(err) return rej(err);

                res(data);
              });
            });

            const userLikes = new Promise((res, rej) => {
              Like.find({ userID: currentUserID }, (err, data) => {
                if(err) return rej(err);

                res(data);
              });
            });

            const moviesLength = new Promise((res, rej) => {
              Movie.find({}, (err, data) => {
                if(err) return rej(err);

                res(data.length);
              });
            });

            Promise
              .all([ newMovies, userComments, userLikes, moviesLength ])
              .then(([ moviesData, commentsData, likesData, moviesLength ]) => {
                
                res.status(200).send({ login: login,
                                       isAdmin: data.isAdmin,
                                       lastLogin: lastLogin,
                                       newMovies: moviesData,
                                       userComments: commentsData,
                                       userLikes: likesData,
                                       moviesLength: moviesLength,
                                       id: data._id
                                    });

              })
              .catch(err => {
                res.status(500).send({ message: err });
              });

           }
    })

});

app
  .route("/logout")
  .post((req, res) => {
    
    const { login } = req.body;

    if (!login || login.trim() === "" )
      res.status(400).send({ message: "Bad request" });
    
    User.findOneAndUpdate({ login }, { lastLogin: Date.now()}, (err, data) => {
      if (err)
        return res.send(500, { error: err });
    
      return res.send({message: "Last login date succesfully saved"});
    });

});

app
  .route("/movies")
  .get((req, res) => {
    
    let movies = [];

    Movie.find({}, (err, data) => {
      if (err)
        return res.send(500, { error: err });

      let likesRequests = data.map(movie => new Promise((resolve, reject) => {
          Like.find({ movieID: movie._id}, (likeErr, likeData) => {
            if (likeErr)
              return res.send(500, { error: likeErr });
            resolve(likeData.length);
          })
        }))


      let commentsRequests = data.map(movie => new Promise((resolve, reject) => {
          Comment.find({ movieID: movie._id}, (commentErr, commentData) => {
            if (commentErr)
              return res.send(500, { error: commentErr });
            resolve(commentData.length);
           
          })
        }))


      Promise
        .all([Promise.all(likesRequests), Promise.all(commentsRequests)])
        .then(([likesData, commentsData]) => {

          data.forEach((movie, index) => {
                      let editedMovie = {...movie._doc};
                          editedMovie.likes = likesData[index];
                          editedMovie.comments = commentsData[index];
                          movies.push(editedMovie);
                    })

          res.send({ movies: movies });
        })


    });


});

app
  .route("/movie/:id")
  .get((req, res) => {
    
    const id = req.params.id;

    Movie.findOne({ _id: id}, (err, data) => {

      if (err)
        return res.send(500, { error: err });
    
      return res.send(data);
    });

});

app
  .route("/likes/:id")
  .get((req, res) => {
    
    const id = req.params.id;

    Like.find({ movieID: id}, (err, data) => {

      if (err)
        return res.send(500, { error: err });
    
      return res.send(data);
    });

  })
  .post((req, res) => {

    const movieID = req.params.id;

    const { userID } = req.body;

    Like.create({ userID: userID, movieID: movieID}, (likeAddError, success) => {
      if (likeAddError)
        return res.send(500, { addLikeError: likeAddError });

      Like.find({ userID: userID }, (likeFindAllError, likes) => {
        if (likeFindAllError)
        return res.send(500, { likeFindAllError: likeFindAllError });

        return res.send(likes);
      })
    
      
    })


  })
  .delete((req, res) => {

    const movieID = req.params.id;

    const { userID } = req.body;

    Like.remove({ userID: userID, movieID: movieID}, (likeRemoveError, success) => {
      if (likeRemoveError)
        return res.send(500, { addRemoveError: likeRemoveError });

      Like.find({ userID: userID }, (likeFindAllError, likes) => {
        if (likeFindAllError)
        return res.send(500, { likeFindAllError: likeFindAllError });

        return res.send(likes);
      })
    
      
    })


  })

app
  .route("/comments/:id")
  .get((req, res) => {
    
    const id = req.params.id;

    Comment.find({ movieID: id}, (err, data) => {

      if (err)
        return res.send(500, { error: err });
    
      return res.send(data);
    });

  })
  .post((req, res) => {

    const movieID = req.params.id;

    const { userID, text } = req.body;

    Comment.create({ userID: userID, movieID: movieID, text: text}, (commentAddError, success) => {
      if (commentAddError)
        return res.send(500, { commentAddError: commentAddError });

      Comment.find({ userID: userID }, (commentFindAllError, comments) => {
        if (commentFindAllError)
        return res.send(500, { commentFindAllError: commentFindAllError });

        return res.send(comments);
      })
    
      
    })


  })



app.listen(8000, () => {
  console.log("Express is listening on port 8000");
});