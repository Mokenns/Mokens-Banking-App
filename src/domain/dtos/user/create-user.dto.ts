import { regularExp } from '../../../config';

export class CreateUserDTO {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, CreateUserDTO?] {
    const { name, email, password } = object;

    if (!name) return ['name is required'];
    if (!password) return ['password is required'];
    if (!regularExp.password.test(password)) return ['invalid password format'];
    if (!email) return ['email is required'];
    if (!regularExp.email.test(email)) return ['email is invalid'];

    return [
      undefined,
      new CreateUserDTO(
        name.trim().toLowerCase(),
        email.trim().toLowerCase(),
        password.trim()
      ),
    ];
  }
}
