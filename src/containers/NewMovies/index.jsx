import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Logo from '../../containers/Logo';
import User from '../../containers/User';
import UserMenu from '../../components/UserMenu';
import Movies from '../../containers/Movies';

class NewMovies extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			movies: []
		}
	}


	componentDidMount() {
		
		fetch('http://localhost:8000/movies')
		.then(res => res.json())
		.then(res => {
			this.setState({ movies: res.movies });
		})
	}
	render() {

		const { user, newMovies } = this.props;
		const { movies } = this.state;

		if (!user.login) 
			return <Redirect to="/"/>

		return (
			<div className="container">
				
				<div className="header">
				
					<Logo/>
					
					<User login={user.login}
						  isAdmin={user.isAdmin}/>
				
				</div>
				
				<UserMenu moviesQuantity={movies.length}/>

				<Movies moviesList={newMovies}/>

			</div>
			)
	}

}

const mapStateToProps = state => {
		return {
			user: state.user,
			newMovies: state.newMovies
		}
}

export default NewMovies = connect(mapStateToProps)(NewMovies);