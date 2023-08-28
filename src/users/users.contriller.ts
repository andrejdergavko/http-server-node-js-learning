import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { sign } from 'jsonwebtoken';

import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUserController } from './users.controller.interface';
import { HTTPError } from '../errors/http-error.class';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard.middleware';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private config: IConfigService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);

		if (!result) {
			return next(new HTTPError(404, 'Not found', 'login'));
		}

		const secret = await this.config.get<string>('SECRET');
		const JWT = await this.signJWT(req.body.email, secret);

		res.send({ JWT });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HTTPError(422, 'User already exists'));
		}

		res.send({ email: result.email, id: result.id });
	}

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await this.userService.getUser({ email: req.user });

		if (!user) {
			return next(new HTTPError(404, 'User not found'));
		}

		res.send({ id: user.id, email: user.email });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token as string);
					}
				},
			);
		});
	}
}
