export function userLogin(login, isAdmin, lastLogin, moviesLength, id) {
	return {
		type: 'USER_LOGIN',
		login,
		isAdmin,
		lastLogin,
		moviesLength,
		id
	}
}