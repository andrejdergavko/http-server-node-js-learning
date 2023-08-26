import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('Error loading .env file');
		} else {
			this.logger.log('Loading .env file');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get<T extends string>(key: string): T {
		return this.config[key] as T;
	}
}
