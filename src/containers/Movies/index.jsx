import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Movies.css';

class Movies extends Component {

  render() {
  	const { moviesList } = this.props;
    
    if (moviesList.length === 0)
      return (
        <div>
          <h2>Nothing was found since your last login.</h2>
        </div>
        )

    const movies = moviesList.map((movie, index) => 
        (
              <div key={index} className="Movie">
                <div>
                  <Link to={`/movie/${movie._id}`}>
                    <img src={movie.image ? movie.image : "/img/video-play.png"}
                         alt={movie.title}
                         width="100%"/>
                  </Link>
                </div>
                <p><span>{movie.title}</span></p>
                <p><img src="/img/like.png" alt="like" />&nbsp;&nbsp;&nbsp;{movie.likes}</p>
                <p><img src="/img/comment.png" alt="comment" />&nbsp;&nbsp;&nbsp;{movie.comments}</p>
                <p><img src="/img/calendar.png" alt="calendar" />&nbsp;&nbsp;&nbsp;{movie.date.split("T")[0]}</p>
              </div>
          ));

    return (
        <div className="Movies_List">
          
          {movies}
          
        </div>)
  }
}


export default Movies;