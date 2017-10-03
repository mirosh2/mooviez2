import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Logo from '../../containers/Logo';
import User from '../../containers/User';
import UserMenu from '../../components/UserMenu';
import AdminMenu from '../../components/AdminMenu';
import { userLikesUpdate } from '../../actions/userLikesUpdate';
import { userCommentsUpdate } from '../../actions/userCommentsUpdate';

import './Movie.css';

class Movie extends Component {
	constructor(props) {
		super(props); 
		
		this.state = {
			movie: {},
			likes: [],
			comments: [],
			commentText: ""
		}

		this.addLike = this.addLike.bind(this);
		this.addComment = this.addComment.bind(this);
		this.handleEnterComment = this.handleEnterComment.bind(this);
	}


	componentDidMount() {
		const movieID = this.props.match.params.id;

		const likesRequest = new Promise((resolve, reject) => {
			fetch(`http://localhost:8000/likes/${movieID}`)
				.then(res => res.json())
				.then(res => { resolve(res); })
		});

		const commentsRequest = new Promise((resolve, reject) => {
			fetch(`http://localhost:8000/comments/${movieID}`)
				.then(res => res.json())
				.then(res => { resolve(res); })
		});

		
		const movieRequest = new Promise((resolve, reject) => {
			fetch(`http://localhost:8000/movie/${movieID}`)
				.then(res => res.json())
				.then(res => { resolve(res); })
		});

		Promise
            .all([ movieRequest, likesRequest, commentsRequest ])
            .then(([ movieData, likesData, commentsData ]) => {
                
                this.setState({ movie: movieData,
                				likes: likesData,
                				comments: commentsData
                              });
              })
	}

	addLike(ev) {
		ev.preventDefault();

		const movieID = this.props.match.params.id;

		const { likes } = this.state;
		const { user, userLikesUpdate } = this.props;

		const userMovieLikes = likes
								.filter(like => like.movieID === movieID)
								.find(like => like.userID === user.id);

		if (!userMovieLikes)
			{
				fetch(`http://localhost:8000/likes/${movieID}`, {
					method: 'POST',
			   		headers: {
					      'Accept': 'application/json',
					      'Content-Type': 'application/json'
					    },
			   		body: JSON.stringify({userID : user.id})
				})
					.then(res => res.json())
					.then(res => { 
						userLikesUpdate(res.filter(like => like.userID === user.id));
						this.setState({ likes: res })
					})
			}
		else {
			fetch(`http://localhost:8000/likes/${movieID}`, {
					method: 'DELETE',
			   		headers: {
					      'Accept': 'application/json',
					      'Content-Type': 'application/json'
					    },
			   		body: JSON.stringify({userID : user.id})
				})
					.then(res => res.json())
					.then(res => { 
						userLikesUpdate(res.filter(like => like.userID === user.id));
						this.setState({ likes: res })
					})
		}
	}

	addComment(ev) {
		ev.preventDefault();

		const movieID = this.props.match.params.id;

		const { user, userCommentsUpdate } = this.props;
		const { commentText } = this.state;

		fetch(`http://localhost:8000/comments/${movieID}`, {
				method: 'POST',
			   	headers: {
					'Accept': 'application/json',
					 'Content-Type': 'application/json'
				},
			   	body: JSON.stringify({ 
			   		userID : user.id,
			   		text: commentText
			   		})
				})
					.then(res => res.json())
					.then(res => { 
						console.log(res);
						userCommentsUpdate(res);
						this.setState({
						 comments: res,
						 commentText: "" })
					})
	}

	handleEnterComment(ev) {
		ev.preventDefault();
		this.setState({ commentText: ev.target.value });
	}

	render() {

		const { user } = this.props;

		if (!user.login) 
			return <Redirect to="/"/>

		const menuType = user.isAdmin ? 
			<AdminMenu moviesQuantity={user.moviesLength}/> : <UserMenu moviesQuantity={user.moviesLength}/>

		const { movie, comments, likes, commentText } = this.state;

		const movieLikesLength = likes.filter(like => like.movieID === movie._id).length;
		
		const movieCommentsLength = 
			comments.filter(comment => (comment.movieID === movie._id)&&(comment.published === true)).length;

		let allMovieComments = [];

		comments.forEach((comment, index) => {
			if (comment.published)
			allMovieComments.push(
				( <div key={index} className="userComment">
					<div className="userComment_header">
						<p>{comment.userName}</p>
						<p>{comment.date.split("T")[0]}</p>
					</div>
					<p className="userComment_text">{comment.text}</p>
			 	  </div> ))
		})

		return (
			<div className="container">
				
				<div className="header">
				
					<Logo/>
					
					<User login={user.login}
						  isAdmin={user.isAdmin}/>
				
				</div>
				
				{menuType}

				<div className="movieContainer">
					<div className="movieImage">
						<img src={movie.image  ? movie.image : "/img/video-play.png"} alt="movie"/>
					</div>
					<div className="movieDescription">
						<p><b>{movie.title}</b></p>
						<p>{movie.description}</p>
						<p className="movieDate">
							<img src="/img/calendar.png" alt="calendar"/>
							&nbsp;{movie.date ? movie.date.split("T")[0] : null}
						</p>
						<p className="movieLikes">
							<a href="/" onClick={this.addLike}>
							   <img src="/img/like.png" alt="like"/>
							</a>&nbsp;{movieLikesLength}
						</p>
						<p className="movieComments">
							<img src="/img/comment.png" alt="comment"/>
							&nbsp;{movieCommentsLength}
						</p>
					</div>
				</div>

				<div className="addComment">
					<label>Add your comment:<br/>
						<textarea onChange={this.handleEnterComment}
						          value={commentText}>

						</textarea><br/>
					</label>
					<button onClick={this.addComment}>+ Add Comment</button>
				</div>

				<div className="newCommentsContainer">
					{allMovieComments}
				</div>

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
			userLikesUpdate: (likes) => dispatch(userLikesUpdate(likes)),
			userCommentsUpdate: (comments) => dispatch(userCommentsUpdate(comments)),
		}
}

export default Movie = connect(mapStateToProps, mapDispatchToProps)(Movie);