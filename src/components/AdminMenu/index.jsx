import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import '../UserMenu/UserMenu.css';

class AdminMenu extends Component {

  render() {
    const { moviesQuantity } = this.props;

    
    let active;
    //eslint-disable-next-line
    switch (location.pathname) {
      case "/movies": { active = 1; break;}
      case "/topvotes": { active = 2; break;}
      case "/topcomments": { active = 3; break;}
      case "/newcomments": { active = 4; break;}
      case "/addmovie": { active = 5; break;}
    }
    return (
      <ul className="mainMenu">
        <li className={active === 1 ? "activeMenu" : null}><Link to="/movies">All movies</Link><b>&nbsp;{moviesQuantity}</b></li>
        <li className={active === 2 ? "activeMenu" : null}><Link to="/topvotes">Most liked</Link></li>
        <li className={active === 3 ? "activeMenu" : null}><Link to="/topcomments">Most commented</Link></li>
        <li className={active === 4 ? "activeMenu" : null}><Link to="/newcomments">New comments</Link></li>
        <li className={active === 5 ? "activeMenu" : null}><Link to="/addmovie">+ Add movie</Link></li>
      </ul>
    );
  }
}

const mapStateToProps = state => {
    return { 
      user: state.user
    }
}

export default AdminMenu = connect(mapStateToProps)(AdminMenu);