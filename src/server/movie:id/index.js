module.exports = function(app, Movie) {

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

}