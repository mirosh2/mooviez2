const initialState = {};


function user(state = initialState, action) {

	switch (action.type) {
		
		case "USER_LOGIN":

			return {...state,
				     login: action.login,
				     isAdmin: action.isAdmin,
				     lastlogin: action.lastLogin,
				     moviesLength: action.moviesLength,
				     id: action.id
			}

		case "USER_LOGOUT":

			return {}

		default:
			return state;
	}
	
}

export default user;