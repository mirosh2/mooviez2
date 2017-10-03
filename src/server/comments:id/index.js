module.exports = function(app, Comment, User) {

  app
    .route("/comments/:id")
    .get((req, res) => {
      
      const id = req.params.id;

      Comment.find({ movieID: id}, (err, data) => {

        if (err)
          return res.send(500, { error: err });

        let userNameRequests = data.map(comment => new Promise((resolve, reject) => {
            User.find({ _id: comment.userID}, (userErr, userData) => {
              if (userErr)
                return res.send(500, { error: userErr });
              resolve(userData[0].login);
            })
          }))

        Promise
          .all(userNameRequests)
          .then(usersData => {

            let editedComments = [];

            data.forEach((comment, index) => {
                            editedComments[index] = {...comment._doc};
                            editedComments[index].userName = usersData[index];
                      })

            res.send(editedComments);
          })
      
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