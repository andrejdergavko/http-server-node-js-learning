export interface IConfigService {
	get: <T extends string>(key: string) => T;
}
