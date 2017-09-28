import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './UserMenu.css';

class UserMenu extends Component {

  render() {
    const { comments,
            likes,
            newMovies,
            moviesQuantity } = this.props;

    
    let active;
    //eslint-disable-next-line
    switch (location.pathname) {
      case "/movies": { active = 1; break;}
      case "/votes": { active = 2; break;}
      case "/comments": { active = 3; break;}
      case "/new": { active = 4; break;}
    }
    return (
      <ul className="mainMenu">
        <li className={active === 1 ? "activeMenu" : null}><Link to="/movies">All movies</Link><b>&nbsp;{moviesQuantity}</b></li>
        <li className={active === 2 ? "activeMenu" : null}><Link to="/votes">Your upvote</Link><b>&nbsp;{likes.length}</b></li>
        <li className={active === 3 ? "activeMenu" : null}><Link to="/comments">Your comments</Link><b>&nbsp;{comments.length}</b></li>
        <li className={active === 4 ? "activeMenu" : null}><Link to="/new">New movies</Link><b>&nbsp;{newMovies.length}</b></li>
      </ul>
    );
  }
}

const mapStateToProps = state => {
    return { 
      comments: state.comments,
      likes: state.likes,
      newMovies: state.newMovies,
    }
}

export default UserMenu = connect(mapStateToProps)(UserMenu);