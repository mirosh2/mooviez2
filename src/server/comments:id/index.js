module.exports = function(app, Comment) {

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

}