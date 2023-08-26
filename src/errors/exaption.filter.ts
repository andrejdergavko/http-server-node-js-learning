import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';

import { IExaptionFilter } from './exaption.filter.interface';
import { HTTPError } from './http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ExaptionFilter implements IExaptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`Error: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(err.message);
			res.status(500).send({ err: err.message });
		}
	}
}
