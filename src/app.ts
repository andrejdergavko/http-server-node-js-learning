import { injectable, inject } from 'inversify';
import express, { Express } from 'express';
import 'reflect-metadata';
import { Server } from 'http';
import { json } from 'body-parser';

import { UsersController } from './users/users.contriller';
import { IExaptionFilter } from './errors/exaption.filter.interface';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UsersController,
		@inject(TYPES.ExaptionFilter) private exaptionFilter: IExaptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExaptionFilters(): void {
		this.app.use(this.exaptionFilter.catch.bind(this.exaptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExaptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
