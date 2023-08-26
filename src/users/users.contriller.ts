import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';

import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUserController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		console.log(111);
		res.send('Login');
	}
	register(req: Request, res: Response, next: NextFunction): void {
		res.send('register');
	}
}
