import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: 'get' | 'post' | 'put' | 'delete';
	middlewares?: IMiddleware[];
}
