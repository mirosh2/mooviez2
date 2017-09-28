import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { userLogin } from '../../actions/userLogin';
import { userLikesLogin } from '../../actions/userLikesLogin';
import { userMoviesLogin } from '../../actions/userMoviesLogin';
import { userCommentsLogin } from '../../actions/userCommentsLogin';

import './Login.css';


class Login extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			login: "",
			password: "",
			auth: false
		}

		this.handleLoginInput = this.handleLoginInput.bind(this);
		this.handlePasswordInput = this.handlePasswordInput.bind(this);
		this.handleLoginForm = this.handleLoginForm.bind(this);
	}

	handleLoginInput(e) {
		this.setState({ login: e.target.value});
	}

	handlePasswordInput(e) {
		this.setState({ password: e.target.value});
	}

	handleLoginForm(e) {
		const { login, password } = this.state;
		const { userLogin,
				userLikesLogin,
				userMoviesLogin,
				userCommentsLogin
				 } = this.props;
		
		e.preventDefault();

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
				this.setState({ auth: true });
			});
	}

	render() {
		const { auth, login, password } = this.state;

		if (auth) 
			return <Redirect to="/movies"/>

		return (
			<div>
				<h1>Welcome to Mooviez</h1>
        		<p>You rate matters</p>
        		<div><img src="/img/logo.png" alt="logo"/></div>
				
				<form className="loginForm"
					  method="POST"
					  onSubmit={this.handleLoginForm}>
					
					<label><b>Login</b><br/>
						<input  type="text"
						  		name="login"
						  		placeholder="Enter your awesome nickname"
						  		value={login}
						  		onChange={this.handleLoginInput}/>
					</label>
					<br/>
					<br/>
					<br/>
					<label><b>Password</b><br/>
						<input  type="password"
						  		name="password"
						  		placeholder="Enter your secure password"
						  		value={password}
						  		onChange={this.handlePasswordInput}/>
					</label>

					<button type="submit"
							onClick={this.handleLoginForm}>Sign In
					</button>

					<Link to="/signup">Sign Up</Link>

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

export default Login = connect(null, mapDispatchToProps)(Login);