import 'reflect-metadata';
import { UserModel } from '@prisma/client';

import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from '../types';
import { UserService } from './users.service';
import { User } from './user.entity';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUserRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UserRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUserRepository>(TYPES.UserRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('Users Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValue('SALT');
		usersRepository.find = jest.fn().mockReturnValue(null);
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				id: 1,
				email: user.email,
				name: user.name,
				password: user.password,
			}),
		);

		createdUser = await usersService.createUser({
			email: 'email@aa.com',
			name: 'name',
			password: 'password',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('password');
	});

	describe('validateUser', () => {
		it('return true if user is valid', async () => {
			usersRepository.find = jest.fn().mockReturnValue(createdUser);

			const result = await usersService.validateUser({
				email: 'email@aa.com',
				password: 'password',
			});

			expect(result).toEqual(true);
		});

		it('return false if user is invalid', async () => {
			usersRepository.find = jest.fn().mockReturnValue(createdUser);

			const result = await usersService.validateUser({
				email: 'email@aa.com',
				password: 'password1',
			});

			expect(result).toEqual(false);
		});

		it('return false if user is not found', async () => {
			usersRepository.find = jest.fn().mockReturnValue(null);

			const result = await usersService.validateUser({
				email: 'email@aa.com',
				password: 'password1',
			});

			expect(result).toEqual(false);
		});
	});
});
