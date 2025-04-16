import { regularExp } from '../../../config';

export class LoginUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ['email is required'];
    if (!password) return ['password is required'];
    if (!regularExp.password.test(password))
      return ['format password is invalid'];
    if (!regularExp.email.test(email)) return ['email is invalid'];

    return [
      undefined,
      new LoginUserDto(email.trim().toLowerCase(), password.trim()),
    ];
  }
}
