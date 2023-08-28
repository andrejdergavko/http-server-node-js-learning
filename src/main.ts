import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExaptionFilter } from './errors/exaption.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.contriller';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExaptionFilter } from './errors/exaption.filter.interface';
import { IUserController } from './users/users.controller.interface';
import { IUserService } from './users/users.service.interface';
import { UserService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';

export interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExaptionFilter>(TYPES.ExaptionFilter).to(ExaptionFilter);
	bind<IUserController>(TYPES.UserController).to(UsersController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
