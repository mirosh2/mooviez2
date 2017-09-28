import { combineReducers } from 'redux';


import user from './user';
import likes from './likes';
import newMovies from './newMovies';
import comments from './comments';

export default combineReducers({
	user,
	likes,
	newMovies,
	comments
})