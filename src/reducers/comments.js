const initialState = [];


function comments(state = initialState, action) {

	switch (action.type) {
		
		case "USER_COMMENTS_LOGIN":

			return [ ...state, ...action.comments ]

		case "USER_COMMENTS_UPDATE":

			return [ ...action.comments ]

		case "USER_COMMENTS_LOGOUT":

			return []

		default:
			return state;
	}
	
}

export default comments;