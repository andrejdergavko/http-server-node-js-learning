import { injectable, inject } from 'inversify';
import express, { Express } from 'express';
import 'reflect-metadata';
import { Server } from 'http';
import { json } from 'body-parser';

import { UsersController } from './users/users.contriller';
import { IExaptionFilter } from './errors/exaption.filter.interface';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UsersController,
		@inject(TYPES.ExaptionFilter) private exaptionFilter: IExaptionFilter,
		@inject(TYPES.ConfigService) private config: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.config.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
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
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
