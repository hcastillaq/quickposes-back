import hapi from '@hapi/hapi';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../db/schemas/user.schema';
import { User } from '../interfaces/user';
import { jwtEncode } from '../services/jwt.service';

const AuthScheme = Joi.object({
	email: Joi.string().email({ tlds: { allow: false } }),
	password: Joi.string().required(),
});

export default (server: hapi.Server) => {
	const ROUNDS = 10;

	//register
	server.route({
		method: 'POST',
		path: '/auth/register',
		options: {
			handler: async (request: hapi.Request, h) => {
				const payload: User = request.payload as User;
				let { email, password } = payload;
				//check if user exists
				const user = await UserModel.findOne({ email });
				if (user) {
					return h
						.response({
							message: 'User already exists',
							statusCode: 400,
						})
						.code(400);
				}

				password = await bcrypt.hash(password, ROUNDS);
				const newUser = new UserModel({
					email,
					password,
					favorites: [],
					id: uuidv4(),
				});
				return newUser
					.save()
					.then((user) => {
						return h
							.response({
								message: 'User created successfully',
								result: jwtEncode({ email: newUser.email, id: newUser.id }),
							})
							.code(201);
					})
					.catch((err) => {
						return h
							.response({
								message: err.message,
							})
							.code(400);
					});
			},
			cors: true,
			validate: {
				payload: AuthScheme,
			},
		},
	});

	//login
	server.route({
		method: 'POST',
		path: '/auth/login',
		options: {
			handler: async (request: hapi.Request, h) => {
				try {
					const payload: User = request.payload as User;
					let { email, password } = payload;
					const user = await UserModel.findOne({ email });
					//check if user exists
					if (!user) {
						return h
							.response({
								message: 'User not found',
								statusCode: 400,
							})
							.code(400);
					}

					//check if password is correct
					const isValid = await bcrypt.compare(password, user.password || '');

					if (!isValid) {
						return h
							.response({
								message: 'Invalid password',
								statusCode: 400,
							})
							.code(400);
					}
					return h.response({
						message: 'Login successful',
						result: jwtEncode({ email: user.email, id: user.id }),
					});
				} catch (error) {
					console.error(error);
					return h.response({ message: error }).code(400);
				}
			},
			cors: true,
			validate: {
				payload: AuthScheme,
			},
		},
	});
};
