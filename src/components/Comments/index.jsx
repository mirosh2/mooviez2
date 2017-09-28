import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Logo from '../../containers/Logo';
import User from '../../containers/User';
import UserMenu from '../../components/UserMenu';

import './Comments.css';

class Comments extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			userComments: []
		}
	}

	componentDidMount() {
		const { comments } = this.props;

		let userComments = [];
		
		fetch('http://localhost:8000/movies')
		.then(res => res.json())
		.then(res => {

			comments.forEach((comment, index) => {
				const foundMovie = res.movies.find(movie => movie._id === comment.movieID);
				if (foundMovie) {
					userComments.push(comment);
					userComments[index].movieTitle = foundMovie.title;
				}

			});

			this.setState({ userComments: userComments });
		})
	}
	
	render() {

		const { user } = this.props;
		const { userComments } = this.state;

		const comments = userComments.map((comment, index) => 
			( <div key={index} className="userComment">
				 <p><b>{comment.movieTitle}</b></p>
				 <p className="userComment_text">{comment.text}</p>
				 <p className="userComment_date"><img src="/img/calendar.png" alt="date"/>&nbsp;{comment.date.split("T")[0]}</p>
				 <p className="userComment_published">{comment.published ? null : "This comment is not approved by admin as now"}</p>
			  </div>
			))

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

				<div className="commentsContainer">

					{comments}

				</div> 

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