import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const response = await request(application.app)
			.post('/users/register')
			.send({ email: 'email@a.ru', password: 'password_1' });

		expect(response.statusCode).toBe(422);
	});

	it('Login - error', async () => {
		const response = await request(application.app)
			.post('/users/login')
			.send({ email: 'email@a.ru', password: 'invalidPassword' });

		expect(response.statusCode).toBe(404);
	});

	it('Login - success', async () => {
		const response = await request(application.app)
			.post('/users/login')
			.send({ email: 'email1@list.ru', password: 'password' });

		expect(response.statusCode).toBe(200);
	});

	it('Login - should return JWT token', async () => {
		const response = await request(application.app)
			.post('/users/login')
			.send({ email: 'email1@list.ru', password: 'password' });

		console.log('response', response?.body);

		expect(response?.body?.JWT).not.toBeUndefined();
	});
});

afterAll(() => {
	application.close();
});
