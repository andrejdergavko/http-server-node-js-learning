import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUserRepository } from './users.repository.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private config: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}

	async createUser({ email, password, name }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = await this.config.get<string>('SALT');
		await newUser.setPassword(password, Number(salt));

		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.userRepository.create(newUser);
	}
	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
