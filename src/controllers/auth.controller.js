const firestore = require('./../src/firebase/firestore');

const register = async (request, h) => {
	const querySnap = await firestore.collection('users').get();
	const results = querySnap.map((doc) => doc.data());
	return results;
};

exports.register = register;
