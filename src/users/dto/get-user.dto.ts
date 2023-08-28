import { IsEmail } from 'class-validator';

export class GetUser {
	@IsEmail({}, { message: 'Invalid email' })
	email: string;
}
