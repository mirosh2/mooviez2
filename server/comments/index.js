module.exports = function(app, Comment, Movie, User) {

  app
    .route("/comments")
    .get((req, res) => {
      
      Comment.find({}, (err, allComments) => {

        if (err)
          return res.send(500, { error: err });

        let moviesNameRequests = allComments.map(comment => new Promise((resolve, reject) => {
            Movie.find({ _id: comment.movieID}, (movieErr, movieData) => {
              if (movieErr)
                return res.send(500, { error: movieErr });
              resolve(movieData[0].title);
            })
          }))

        let userNameRequests = allComments.map(comment => new Promise((resolve, reject) => {
            User.find({ _id: comment.userID}, (userErr, userData) => {
              if (userErr)
                return res.send(500, { error: userErr });
              resolve(userData[0].login);
            })
          }))

        Promise
          .all([Promise.all(moviesNameRequests), Promise.all(userNameRequests)])
          .then(([moviesData, usersData]) => {

            let editedComments = [];

            allComments.forEach((comment, index) => {
                            editedComments[index] = {...comment._doc};
                            editedComments[index].userName = usersData[index];
                            editedComments[index].movieTitle = moviesData[index];
                      })

            res.send(editedComments);
          })
      
      });

    })
  .delete((req, res) => {

    const { commentID } = req.body;

    Comment.remove({ _id: commentID }, (commentDeleteErr, commentDeletesuccess) => {
      if (commentDeleteErr)
        res.status(500).send({ error: commentDeleteErr })

      Comment.find({}, (err, allComments) => {
        if (err)
          res.status(500).send({ error: err })

        res.status(200).send(allComments);
      })

    })
  
  })
  .put((req, res) => {

    const { commentID } = req.body;

    Comment.findOneAndUpdate(
      { _id: commentID },
      { published: true },
      (commentUpdateErr, commentUpdatesuccess) => {
      
      if (commentUpdateErr)
        res.status(500).send({ error: commentUpdateErr })

      Comment.find({}, (err, allComments) => {
        if (err)
          res.status(500).send({ error: err })

        res.status(200).send(allComments);
      })

    })
  
  })

}