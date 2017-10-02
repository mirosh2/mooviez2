import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Logo from '../../containers/Logo';
import User from '../../containers/User';
import UserMenu from '../../components/UserMenu';

import { userLogin } from '../../actions/userLogin';
import { userLikesLogin } from '../../actions/userLikesLogin';
import { userMoviesLogin } from '../../actions/userMoviesLogin';
import { userCommentsLogin } from '../../actions/userCommentsLogin';

class Profile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			newLogin: "",
			newPassword: "",
			isUserChanged: false,
			userExists: false
		}

		this.changeLogin = this.changeLogin.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}
	
	changeLogin(e) {
		e.preventDefault();
		this.setState({ newLogin: e.target.value })
	}

	changePassword(e) {
		e.preventDefault();
		this.setState({ newPassword: e.target.value })
	}

	changeUser(e) {
		e.preventDefault();
		const { newLogin, newPassword } = this.state
		const { userLogin,
				userLikesLogin,
				userMoviesLogin,
				userCommentsLogin,
				user
				 } = this.props;

		let isLoginChanged = false;
		
		if (newLogin !== user.login)
			isLoginChanged = true;

		fetch('http://localhost:8000/profile', {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				login: newLogin,
				password: newPassword,
				userID: user.id,
				isLoginChanged: isLoginChanged
			})
		})
		.then(res => res.json())
		.then(res => {
			switch (res.message) {
				
				case "OK": {
					fetch('http://localhost:8000/login',
					 { method: 'POST',
					   headers: {
					      'Accept': 'application/json',
					      'Content-Type': 'application/json'
					    },
					   body: JSON.stringify({login: newLogin, password: newPassword})
					 })
					.then(res => res.json())
					.then(res => {
						const { login,
						        isAdmin,
						        lastLogin,
						        newMovies,
						        userComments,
						        userLikes,
						        moviesLength,
						        id } = res;
						userLogin(login, isAdmin, lastLogin, moviesLength, id);
						userMoviesLogin(newMovies);
						userLikesLogin(userLikes);
						userCommentsLogin(userComments);
						this.setState({
								isUserChanged: true
							});	
					})
					break;
				}

				case "EXISTS": {
					this.setState({
						password: "",
						login: "",
						userExists: true
					})
					break;
				}

				default:
					return;
			}
		})

	}

  render() {
  	const { isUserChanged, userExists } = this.state;
  	const { user } = this.props;
    
    if (!user.login) 
			return <Redirect to="/"/>

    if (isUserChanged)
    	return <Redirect to='/movies'/>

    return (
      <div className="container">
				
			<div className="header">
				
				<Logo/>
					
				<User login={user.login}
					  isAdmin={user.isAdmin}/>
				
			</div>
				
			<UserMenu moviesQuantity={user.moviesLength}/>
    
        {userExists ? 
        	(<p>Sorry, this name is used by another person</p>) : null }

    	    <form onSubmit={this.changeUser} method="POST">
        	<h2>Please enter new data to change your profile</h2>
        	<label>Login 
        		<input type="text"
        					 name="login"
        					 placeholder="Type your awesome nickname"
        					 value={this.state.newLogin}
        					 onChange={this.changeLogin}
        					 required
        		/>
        	</label><br/>
        	<label>Password 
        		<input type="password"
        		       name="password"
        		       placeholder="Type your secure password"
        		       value={this.state.newPassword}
        		       onChange={this.changePassword}
        		       required
        		/>
        	</label><br/>
        	<button type="submit">Change Profile</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
		return {
			user: state.user
		}
}

const mapDispatchToProps = dispatch => {
	return {
			userLogin: (login, isAdmin, lastLogin, moviesLength, id) => 
							dispatch(userLogin(login, isAdmin, lastLogin, moviesLength, id)),
			userLikesLogin: (likes) => dispatch(userLikesLogin(likes)),
			userMoviesLogin: (newMovies) => dispatch(userMoviesLogin(newMovies)),
			userCommentsLogin: (comments) => dispatch(userCommentsLogin(comments))
	}
}

export default Profile = connect(mapStateToProps, mapDispatchToProps)(Profile);