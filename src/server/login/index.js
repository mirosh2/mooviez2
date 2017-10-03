module.exports = function(app, User, Comment, Movie, Like) {

  app
    .route("/login")
    .post((req, res) => {
      
      const { login, password } = req.body;
      
      let lastLogin, currentUserID, isAdmin;

      console.log("login",login);
      console.log("password",password);

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


}

