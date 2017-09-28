module.exports = function(app, Like) {

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

}