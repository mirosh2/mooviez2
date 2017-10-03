import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Logo from '../../containers/Logo';
import User from '../../containers/User';
import AdminMenu from '../../components/AdminMenu';

import './NewComments.css';

class NewComments extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			comments: []
		}

		this.confirmComment = this.confirmComment.bind(this);
  		this.rejectComment = this.rejectComment.bind(this);
	}


	componentDidMount() {
		
		fetch('http://localhost:8000/comments')
		.then(res => res.json())
		.then(res => {
			this.setState({ comments: res.filter(comment => comment.published === false) });
		})
	}

	confirmComment(commentID) {
		fetch('http://localhost:8000/comments', {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				commentID: commentID
			})
		})
		.then(res => res.json())
		.then(res => {
			if (res.message === "OK")
				fetch('http://localhost:8000/comments')
				.then(res => res.json())
				.then(res => {
				this.setState({ comments: res.filter(comment => comment.published === false) });
				})
		})
	}

	rejectComment(commentID) {
		fetch('http://localhost:8000/comments', {
			method: "DELETE",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				commentID: commentID
			})
		})
		.then(res => res.json())
		.then(res => {
			this.setState({ comments: res.filter(comment => comment.published === false) });
		})
		
	}

	render() {

		const { user } = this.props;
		const { comments } = this.state;

		
		if (!user.login || user.isAdmin === false) 
			return <Redirect to="/"/>

		const NewComments = comments.map((comment, index) => 
			(
			<div className="notPublishedComment" key={index}>
            
	            <div>
	              <p>User: {comment.userName}</p>
	              <p>Movie: {comment.movieTitle}</p>
	              <p>Comment date: {comment.date.split("T")[0]}</p>
	              <p>Comment text: {comment.text}</p>
	              <button onClick={() => this.confirmComment(comment._id)}>Confirm</button>
	              <button onClick={() => this.rejectComment(comment._id)}>Reject</button>
	            </div>
          	</div>
		))

		return (
			<div className="container">
				
				<div className="header">
				
					<Logo/>
					
					<User login={user.login}
						  isAdmin={user.isAdmin}/>
				
				</div>
				
				<AdminMenu moviesQuantity={user.moviesLength}/>

				<div className="newCommentsContainer">
				 {NewComments}
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

export default NewComments = connect(mapStateToProps)(NewComments);