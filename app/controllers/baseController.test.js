const mongoose = require('mongoose');
const mongoMemoryServer = require('mongodb-memory-server').default;
let mongoServer = new mongoMemoryServer();
const { userModel } = require('../components/user/');

jest.setTimeout(60000);

mongoServer.getConnectionString().then(mongoUri => {
	return mongoose.connect(mongoUri, { useNewUrlParser: true }, err => {
		if (err) return err;
	});
});

afterAll(async () => {
	await mongoose.disconnect();
	// await mongoServer.stop();
});

//im using user schema for testing but its applied for every schema

const user = {
	username: 'bob@gmail.com',
	password: 'OBHG123!',
	firstName: 'bill',
	lastName: 'jordan',
	type: 'user',
	terms: true
};

describe('CRUD Actions Checks', () => {
	test('should add document to database', async () => {
		const added = await userModel.insert(user);
		expect(added).toBeDefined();
	});

	test('should update document on database', async () => {
		const updated = await userModel.update(
			{ username: user.username },
			{ last_name: 'borgan' }
		);
		expect(updated).toBe(true);
	});

	test('should get one document from database', async () => {
		// await userModel.create(user);
		const getUser = await userModel.getOne({ username: user.username });
		expect(getUser.username).toBe(user.username);
	});

	test('should delete document from database', async () => {
		const deleted = await userModel.delete({ username: user.username });
		expect(deleted).toBe(true);
	});

	// test('should get many documents', async () => {
	// 	await userModel.create(user);
	// 	const getUser = await userModel.getMany({});
	// 	expect(typeof getUser).toBe('array');
	// });
});
