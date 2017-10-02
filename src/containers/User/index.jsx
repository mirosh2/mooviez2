import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SignOut from '../../components/SignOut';

import './User.css';

class User extends Component {
  
  render() {
    
    const { login, isAdmin } = this.props;
    const userImage = isAdmin ? "/img/admin.png" : "/img/user.png";
    
    return (
      <div className="user">
        <div>
          <p>{login}</p>
          <img src={userImage} alt="userImage"/>
        </div>
        <Link to="/profile">Profile</Link><br/>
        <SignOut login={login}/>
      </div>
    );
  }
}

export default User;