import hapi from '@hapi/hapi';
import { connectDB } from './db/mongo';
import auth from './routes/auth';
import images from './routes/images';

const init = async () => {
	const PORT = process.env.PORT || 3000;
	const HOST = process.env.HOST || 'localhost';
	const server = hapi.server({
		port: PORT,
		host: HOST,
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});

	// routes
	images(server);
	auth(server);

	await server.start();
	console.log('Server running on %s', server.info.uri);
	connectDB();
};

init();
