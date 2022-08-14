'use strict';

const Hapi = require('@hapi/hapi');
const Jimp = require('jimp');
const JSONdb = require('simple-json-db');
const db = new JSONdb('db.json');

const maxBytes = 9999999999;
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const init = async () => {
	const server = Hapi.server({
		port: PORT,
		host: HOST,
		routes: {
			cors: {
				origin: ['*'], // an array of origins or 'ignore'
			},
		},
	});

	server.route({
		method: 'POST',
		path: '/images/posterize',
		options: {
			cors: true,
			handler: async (request, h) => {
				const levels = request.payload.levels;
				const base64 = request.payload.url.split('base64,')[1];
				const buf = Buffer.from(base64, 'base64');
				try {
					const i = await Jimp.read(buf);
					const src = await i
						.posterize(levels)
						.greyscale()
						.getBase64Async(Jimp.AUTO);
					return {
						base64: src,
					};
				} catch (error) {
					return {
						base64: request.payload.url,
					};
				}
			},
			payload: {
				maxBytes: maxBytes,
			},
		},
	});

	server.route({
		method: 'POST',
		path: '/images/favorites',
		options: {
			cors: true,
			handler: (request, h) => {
				const image = request.payload.image;
				let favorites = db.JSON().favorites;
				const find = favorites.find((favorite) => favorite.path === image.path);
				if (!find) {
					favorites.push(image);
					db.set('favorites', favorites);
				} else {
					favorites = favorites.filter((fav) => fav.path !== image.path);
					db.set('favorites', favorites);
				}
				return {
					action: !find ? 'add' : 'remove',
				};
			},
			payload: {
				maxBytes: maxBytes,
			},
		},
	});

	server.route({
		method: 'GET',
		path: '/images/favorites',
		options: {
			cors: true,
			handler: async (request, h) => {
				return db.JSON().favorites;
			},
		},
	});

	server.route({
		method: 'GET',
		path: '/',
		options: {
			cors: true,
			handler: async (request, h) => {
				return 'hello';
			},
		},
	});

	await server.start();
	console.log('Server running on %s', server.info.uri);
};

init();
