import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Logo from '../../containers/Logo';
import User from '../../containers/User';
import UserMenu from '../../components/UserMenu';
import Movies from '../../containers/Movies';

class Comments extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			allMoviesLength: null,
			commentedMovies: []
		}
	}


	componentDidMount() {
		const { comments } = this.props;

		let commentedMovies = [];
		
		fetch('http://localhost:8000/movies')
		.then(res => res.json())
		.then(res => {

			comments.forEach(comment => {
				const foundMovie = res.movies.find(movie => movie._id === comment.movieID);
				if (foundMovie)
					commentedMovies.push(foundMovie);

			});

			this.setState({ commentedMovies: commentedMovies,
							allMoviesLength: res.movies.length });
		})
	}
	render() {

		const { user } = this.props;
		const { allMoviesLength, commentedMovies } = this.state;

		if (!user.login) 
			return <Redirect to="/"/>

		return (
			<div className="container">
				
				<div className="header">
				
					<Logo/>
					
					<User login={user.login}
						  isAdmin={user.isAdmin}/>
				
				</div>
				
				<UserMenu moviesQuantity={allMoviesLength}/>

				<Movies moviesList={commentedMovies}/>

			</div>
			)
	}

}

const mapStateToProps = state => {
		return {
			user: state.user,
			comments: state.comments
		}
}

export default Comments = connect(mapStateToProps)(Comments);