import mongoose from 'mongoose';

export const FavoriteSchema = new mongoose.Schema({
	baseUrl: String,
	url: String,
	path: String,
});

export const FavoriteModel = mongoose.model('Favorite', FavoriteSchema);
