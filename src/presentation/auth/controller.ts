import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../../domain/dtos/user/create-user.dto';
import { LoginUserDto } from '../../domain/dtos/user/login-user.dto';
import { envs } from '../../config';

export class AuthController {
  constructor(private readonly authService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: 'Something went very wrong!' });
  };

  createUser = (req: Request, res: Response) => {
    const [error, createUserDTO] = CreateUserDTO.execute(req.body);

    if (error) return res.status(422).json({ message: error });

    this.authService
      .create(createUserDTO!)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, credentials] = LoginUserDto.execute(req.body);

    if (error) return res.status(422).json({ message: error });

    this.authService
      .login(credentials!)
      .then((data) => {
        res.cookie('token', data.token, {
          httpOnly: true,
          secure: envs.NODE_ENV === 'dev',
          sameSite: 'strict',
          maxAge: 180000,
        });
        return res.status(200).json({ user: data.user });
      })
      .catch((error) => this.handleError(error, res));
  };
}
