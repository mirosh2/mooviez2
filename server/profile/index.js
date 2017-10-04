module.exports = function(app, User) {

  app
    .route("/profile")
    .post((req, res) => {
      
      const { login, password, userID, isLoginChanged } = req.body;
      
      if ((!login || !password)||((login.trim() === "")||(password.trim()==="")))
        res.status(400).send({ message: "Bad request" });
      
      User.findOne({ login }, (readingUserDBError, data) => {
        if (readingUserDBError)
          res.status(500).send({ error: readingUserDBError });

        if(data && isLoginChanged)
          res.status(200).send({ message: "EXISTS"})
        else 
          User.findOneAndUpdate({ _id: userID }, { login: login, password: password }, (changeUserError, newUser) => {
            if (changeUserError)
              res.status(500).send({ error: changeUserError });

            res.status(200).send({ message: "OK"});

          })     
            
      })

  })


}

