import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../../domain/dtos/user/create-user.dto';
import { LoginUserDto } from '../../domain/dtos/user/login-user.dto';
import { envs } from '../../config';
import { JwtAdapter } from '../../config';

export class UserController {
  constructor(private readonly userService: UserService) {}

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

    this.userService
      .create(createUserDTO!)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, credentials] = LoginUserDto.execute(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .login(credentials!)
      .then((data) => {
        res.cookie('token', data.token, {
          httpOnly: true,
          secure: envs.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3 * 60 * 60 * 1000,
        });
        return res.status(200).json({ user: data.user });
      })
      .catch((error) => this.handleError(error, res));
  };

  findOneUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (id === 'me') {
        const sessionToken = req.cookies.token;
        if (!sessionToken) {
          return res
            .status(401)
            .json({ message: 'Unauthorized: Token missing' });
        }

        const payload = (await JwtAdapter.validateToken(sessionToken)) as {
          id: string;
        };
        console.log('Token payload:', payload);
        if (!payload || !payload.id) {
          return res
            .status(401)
            .json({ message: 'Unauthorized: Invalid token' });
        }

        const user = await this.userService.findOne(payload.id);

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
      }

      const user = await this.userService.findOne(id);
      return res.status(200).json(user);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  validateAccount = (req: Request, res: Response) => {
    const { token } = req.params;

    this.userService
      .validateAccount(token)
      .then(() => res.send('Email validated sucessfully'))
      .catch((err) => this.handleError(err, res));
  };
}
