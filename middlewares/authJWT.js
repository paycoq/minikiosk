const { verify } = require('../util/jwtUtil');
const User = require('../models/User')
const authJWT = (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization; // header에서 access token을 가져옵니다.
		const result = verify(token); // token을 검증
		if (result.ok) {
			req.user = new User(result.id, result.role)
			next();
		} else {
			const error = new Error(result.message); // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
			error.status = 401;
			throw error;
		}
	} else {
		const error = new Error('Unauthorized : 토큰이 존재하지 않습니다.');
		error.status = 401;
		throw error;
	}
};

module.exports = authJWT;
