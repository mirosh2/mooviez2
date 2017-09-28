import React, { Component } from 'react';
import { connect } from 'react-redux';

import { userLogout } from '../../actions/userLogout';
import { userLikesLogout } from '../../actions/userLikesLogout';
import { userCommentsLogout } from '../../actions/userCommentsLogout';
import { userMoviesLogout } from '../../actions/userMoviesLogout';

class SignOut extends Component {
	constructor(props) {
		super(props);
	
  	this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout() {
		
    const { userLogout,
            userLikesLogout,
            userCommentsLogout,
            userMoviesLogout,
            login } = this.props;

    fetch('http://localhost:8000/logout',
       { method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
         body: JSON.stringify({login: login})
       })
      .then(res => res.json())
      .then(res => {
        const { message } = res;
        console.log(message);
        userLikesLogout();
        userCommentsLogout();
        userMoviesLogout();
        userLogout();
      });
    
	}

  render() {
    
    return (
      <div className="signout">
        <button onClick={this.handleLogout}>Sign Out</button>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
	return {
    userLogout: () =>  dispatch(userLogout()),
    userLikesLogout: () =>  dispatch(userLikesLogout()),
    userCommentsLogout: () =>  dispatch(userCommentsLogout()),
		userMoviesLogout: () =>  dispatch(userMoviesLogout())
	}
}

export default SignOut = connect(null, mapDispatchToProps)(SignOut);