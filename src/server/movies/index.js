module.exports = function(app, Movie, Like, Comment) {

  app
    .route("/movies")
    .get((req, res) => {
      
      let movies = [];

      Movie.find({}, (movieErr, data) => {
        if (movieErr)
          return res.send(500, { error: movieErr });

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

}