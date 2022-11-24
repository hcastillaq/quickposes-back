import { Express } from 'express';
import Jimp from 'jimp';
import { UserModel } from '../db/schemas/user.schema';
import { jwtDecode } from '../services/jwt.service';

export default (app: Express) => {
	app.post('/images/posterize', async (req, resp) => {
		const payload: any = req.body;
		const levels = payload.levels;
		const base64 = payload.url.split('base64,')[1];
		const buf = Buffer.from(base64, 'base64');

		try {
			const i = await Jimp.read(buf);
			const src = await i
				.posterize(levels)
				.greyscale()
				.getBase64Async(Jimp.MIME_PNG);

			return resp.json({
				base64: src,
			});
		} catch (error) {
			return resp.json({
				base64: payload.url,
			});
		}
	});

	app.post('/images/favorites/toggle', async (req, resp) => {
		try {
			const payload: any = req.body;
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
			return resp.status(200).json({
				action,
			});
		} catch (error: any) {
			console.log(error);
			if (error.name.toLowerCase() === 'TokenExpiredError'.toLowerCase()) {
				return resp.status(500).json({ error: 'token expired' });
			}
			return resp.status(500).json({ error });
		}
	});

	app.post('/images/favorites', async (req, resp) => {
		try {
			const payload: any = req.body;
			const userToken = jwtDecode(payload.token);
			let favorites = [];
			if (userToken) {
				// get user
				const user = await UserModel.findOne({ id: userToken.id });
				if (user) {
					favorites = user.favorites;
				}
			}
			return resp.status(200).send(favorites);
		} catch (error: any) {
			console.log(error);
			if (error.name.toLowerCase() === 'TokenExpiredError'.toLowerCase()) {
				return resp.status(500).json({ error: 'token expired' });
			}
			return resp.status(500).json({ error });
		}
	});
};
