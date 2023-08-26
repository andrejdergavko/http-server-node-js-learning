export interface ILogger {
	logger: Object;
	log(...args: unknown[]): void;
	error(...args: unknown[]): void;
	warn(...args: unknown[]): void;
}
