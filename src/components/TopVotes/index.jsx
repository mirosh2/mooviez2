import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Logo from '../../containers/Logo';
import User from '../../containers/User';
import Movies from '../../containers/Movies';
import AdminMenu from '../../components/AdminMenu';

class TopVotes extends Component {

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

		const { user } = this.props;
		const { movies } = this.state;

		
		if (!user.login || user.isAdmin === false) 
			return <Redirect to="/"/>

		movies.sort((movie1, movie2) => {
			if (movie1.likes < movie2.likes)
				return 1;
			if (movie1.likes > movie2.likes)
				return -1;
			if (movie1.likes === movie2.likes)
				return 0;
		})

		return (
			<div className="container">
				
				<div className="header">
				
					<Logo/>
					
					<User login={user.login}
						  isAdmin={user.isAdmin}/>
				
				</div>
				
				<AdminMenu moviesQuantity={user.moviesLength}/>

				 <Movies moviesList={movies}/>

			</div>
			)
	}

}

const mapStateToProps = state => {
		return {
			user: state.user
		}
}

export default TopVotes = connect(mapStateToProps)(TopVotes);