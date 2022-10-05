import hapi from '@hapi/hapi';
import Jimp from 'jimp';
import Joi from 'joi';
import { UserModel } from '../db/schemas/user.schema';
import { jwtDecode } from '../services/jwt.service';

export default (server: hapi.Server) => {
	const MAX_BYTES = 9999999999;
	server.route({
		method: 'POST',
		path: '/images/posterize',
		handler: async (request: hapi.Request, h) => {
			const payload: any = request.payload;
			const levels = payload.levels;
			const base64 = payload.url.split('base64,')[1];
			const buf = Buffer.from(base64, 'base64');
			try {
				const i = await Jimp.read(buf);
				const src = await i
					.posterize(levels)
					.greyscale()
					.getBase64Async(Jimp.MIME_PNG);
				return {
					base64: src,
				};
			} catch (error) {
				return {
					base64: payload.url,
				};
			}
		},
		options: {
			cors: true,
			payload: {
				maxBytes: MAX_BYTES,
			},
			validate: {
				payload: Joi.object({
					levels: Joi.number().required(),
					url: Joi.string().required(),
					token: Joi.string().required(),
				}),
			},
		},
	});

	server.route({
		method: 'post',
		path: '/images/favorites/toggle',
		options: {
			cors: true,
			handler: async (request: hapi.Request) => {
				const payload: any = request.payload;
				const userToken = jwtDecode(payload.token);
				let action = false;
				if (userToken) {
					// get user
					const user = await UserModel.findOne({ id: userToken.id });

					if (user) {
						// validate image exists
						const find = user.favorites.find(
							(baseUrl) => baseUrl === payload.baseUrl
						);
						if (!find) {
							// add to favorites
							user.favorites.push(payload.baseUrl);
							await user.save();
							action = true;
						} else {
							// remove from favorites
							user.favorites = user.favorites.filter(
								(baseUrl) => baseUrl !== payload.baseUrl
							);
							await user.save();
							action = false;
						}
					}
				}
				return {
					action,
				};
			},
			payload: {
				maxBytes: MAX_BYTES,
			},
			validate: {
				payload: Joi.object({
					baseUrl: Joi.string().required(),
					token: Joi.string().required(),
				}),
			},
		},
	});

	server.route({
		method: 'post',
		path: '/images/favorites',
		options: {
			cors: true,
			handler: async (request: hapi.Request, h) => {
				try {
					const payload: any = request.payload;
					const userToken = jwtDecode(payload.token);
					let favorites = [];
					if (userToken) {
						// get user
						const user = await UserModel.findOne({ id: userToken.id });
						if (user) {
							favorites = user.favorites;
						}
					}
					return favorites;
				} catch (error) {
					console.log(error);
					return h.response({ error }).code(500);
				}
			},
			payload: {
				maxBytes: MAX_BYTES,
			},
			validate: {
				payload: Joi.object({
					token: Joi.string().required(),
				}),
			},
		},
	});
};
