module.exports = function(app, User) {
  
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

}