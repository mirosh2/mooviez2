const initialState = [];


function likes(state = initialState, action) {

	switch (action.type) {
		
		case "USER_LIKES_LOGIN":

			return [...state, ...action.likes]

		case "USER_LIKES_UPDATE":

			return [...action.likes]

		case "USER_LIKES_LOGOUT":

			return []

		default:
			return state;
	}
	
}

export default likes;