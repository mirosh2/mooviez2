const initialState = [];


function newMovies(state = initialState, action) {

	switch (action.type) {
		
		case "USER_MOVIES_LOGIN":

			return [ ...state, ...action.newMovies ]

		case "USER_MOVIES_LOGOUT":

			return []

		default:
			return state;
	}
	
}

export default newMovies;