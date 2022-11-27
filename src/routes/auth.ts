import bcrypt from 'bcrypt';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../db/schemas/user.schema';
import { User } from '../interfaces/user';
import { jwtEncode } from '../services/jwt.service';

export default (app: Express) => {
	const ROUNDS = 10;

	//register
	app.post('/auth/register', async (req, resp) => {
		const payload: User = req.body as User;
		let { email, password } = payload;
		//check if user exists
		const user = await UserModel.findOne({ email });
		if (user) {
			return resp.status(400).json({
				message: 'User already exists',
				statusCode: 400,
			});
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
			.then(() => {
				return resp.status(201).json({
					message: 'User created successfully',
					result: jwtEncode({ email: newUser.email, id: newUser.id }),
				});
			})
			.catch((err) => {
				return resp.status(400).json({
					message: err.message,
				});
			});
	});

	//login
	app.post('/auth/login', async (req, resp) => {
		try {
			const payload: User = req.body as User;
			let { email, password } = payload;
			const user = await UserModel.findOne({ email });
			//check if user exists
			if (!user) {
				return resp.status(401).json({
					message: 'User not found',
					statusCode: 401,
				});
			}

			//check if password is correct
			const isValid = await bcrypt.compare(password, user.password || '');
			if (!isValid) {
				return resp.status(401).json({
					message: 'Invalid password',
					statusCode: 401,
				});
			}
			return resp.json({
				message: 'Login successful',
				result: jwtEncode({ email: user.email, id: user.id }),
			});
		} catch (error) {
			console.error(error);
			return resp.json({ message: error }).status(400);
		}
	});
};
