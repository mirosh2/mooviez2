import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Logo from '../../containers/Logo';
import User from '../../containers/User';
import UserMenu from '../../components/UserMenu';
import Movies from '../../containers/Movies';

class Votes extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			likedMovies: []
		}
	}


	componentDidMount() {
		const { likes } = this.props;

		let likedMovies = [];
		
		fetch('http://localhost:8000/movies')
		.then(res => res.json())
		.then(res => {

			likes.forEach(like => {
				const foundMovie = res.movies.find(movie => movie._id === like.movieID);
				if (foundMovie)
					likedMovies.push(foundMovie);

			});

			this.setState({ likedMovies: likedMovies });
		})
	}
	render() {

		const { user } = this.props;
		const { likedMovies } = this.state;

		if (!user.login) 
			return <Redirect to="/"/>

		return (
			<div className="container">
				
				<div className="header">
				
					<Logo/>
					
					<User login={user.login}
						  isAdmin={user.isAdmin}/>
				
				</div>
				
				<UserMenu moviesQuantity={user.moviesLength}/>

				<Movies moviesList={likedMovies}/>

			</div>
			)
	}

}

const mapStateToProps = state => {
		return {
			user: state.user,
			likes: state.likes
		}
}

export default Votes = connect(mapStateToProps)(Votes);