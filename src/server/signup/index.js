module.exports = function(app, User) {

  app
    .route("/signup")
    .post((req, res) => {
      
      const { login, password } = req.body;
      
      if ((!login || !password)||((login.trim() === "")||(password.trim()==="")))
        res.status(400).send({ message: "Bad request" });
      
      User.findOne({ login }, (readingUserDBError, data) => {
        if (readingUserDBError)
          res.status(500).send({ error: readingUserDBError });

        if(data)
          res.status(200).send({ message: "EXISTS"})
        else 
          User.create({ login: login, password: password }, (createUserError, newUser) => {
            if (createUserError)
              res.status(500).send({ error: createUserError });

            res.status(200).send({ message: "OK"});

          })     
            
      })

  })


}

