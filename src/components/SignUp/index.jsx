import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { userLogin } from '../../actions/userLogin';
import { userLikesLogin } from '../../actions/userLikesLogin';
import { userMoviesLogin } from '../../actions/userMoviesLogin';
import { userCommentsLogin } from '../../actions/userCommentsLogin';

class SignUp extends Component {

	constructor(props) {
		super(props);

		this.state = {
			login: "",
			password: "",
			isUserCreated: false,
			userExists: false
		}

		this.changeLogin = this.changeLogin.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.createUser = this.createUser.bind(this);
	}
	
	changeLogin(e) {
		e.preventDefault();
		this.setState({login: e.target.value})
	}

	changePassword(e) {
		e.preventDefault();
		this.setState({password: e.target.value})
	}

	createUser(e) {
		e.preventDefault();
		const { login, password } = this.state
		const { userLogin,
				userLikesLogin,
				userMoviesLogin,
				userCommentsLogin
				 } = this.props;
		

		fetch('http://localhost:8000/signup', {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				login: login,
				password: password
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
					   body: JSON.stringify({login: login, password: password})
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
								isUserCreated: true
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
  	const { isUserCreated, userExists } = this.state;
    

    if (isUserCreated)
    	return <Redirect to='/movies'/>

    return (
      <div className="Auth">
        <h1>Welcome to Mooviez</h1>
        <p>You rate matters</p>
        <div><img src="/img/logo.png" alt="logo"/></div>

        {userExists ? 
        	(<p>Sorry, this name is used by another person</p>) : null }

        <form onSubmit={this.createUser} method="POST">
        	<h2>Please fill to create new user</h2>
        	<label>Login 
        		<input type="text"
        					 name="login"
        					 placeholder="Type your awesome nickname"
        					 value={this.state.login}
        					 onChange={this.changeLogin}
        					 required
        		/>
        	</label><br/>
        	<label>Password 
        		<input type="password"
        		       name="password"
        		       placeholder="Type your secure password"
        		       value={this.state.password}
        		       onChange={this.changePassword}
        		       required
        		/>
        	</label><br/>
        	<button type="submit">Create User</button>
        </form>
      </div>
    )
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

export default SignUp = connect(null, mapDispatchToProps)(SignUp);