import { envs } from '../../config';
import { encriptAdapter } from '../../config/bcrypt.adapter';
import { JwtAdapter } from '../../config/jwt.adapter';
import { User } from '../../data/postgres/models/user';
import { CustomError, LoginUserDto } from '../../domain';
import { CreateUserDTO } from '../../domain/dtos/user/create-user.dto';
import { EmailService } from '../common/services/email.service';
import pug from 'pug';
import path from 'path';

export class UserService {
  constructor(private readonly emailService: EmailService) {}
  async findOne(id: string) {
    const user = await User.findOne({
      where: {
        status: true,
        id: id,
      },
    });

    if (!user) {
      throw CustomError.notFound('User not found');
    }
    return user;
  }

  async create(data: CreateUserDTO) {
    const user = new User();

    user.name = data.name;
    user.email = data.email;
    user.password = encriptAdapter.hash(data.password);

    try {
      await user.save();
      this.sendLinkToEmailForAccountValidation(data.email, data.name);
      return {
        message: 'User created successfully',
      };
    } catch (error) {
      throw CustomError.internalServer('Error creating user');
    }
  }

  public findOneUserByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw CustomError.internalServer('email not registered');
    return user;
  };

  public validateAccount = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest('Invalid Token');

    const { email } = payload as { email: string };
    if (!email)
      throw CustomError.internalServer(
        'An error ocurred. Try again and ensure you are using the correct email'
      );

    const user = await this.findOneUserByEmail(email);

    user.status = true;

    try {
      await user.save();

      return {
        message: 'User activated',
      };
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong');
    }
  };

  private sendLinkToEmailForAccountValidation = async (
    email: string,
    name: string
  ) => {
    const token = await JwtAdapter.generateToken({ email }, '3h');
    if (!token) throw CustomError.internalServer('Error getting token');

    const activationLink = `http://${envs.WEBSERVICE_URL}/api/users/validate-account/${token}`;

    const html = pug.renderFile(
      path.join(__dirname, '../templates/verify-account.pug'),
      {
        name,
        email,
        link: activationLink,
      }
    );

    const isSent = await this.emailService.sendEmail({
      to: email,
      subject: 'Confirm your banking API account',
      htmlBody: html,
    });

    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  };

  async login(credentials: LoginUserDto) {
    const user = await this.ensureUserExist(credentials.email);

    this.ensurePasswordIsCorrect(credentials.password, user.password);

    const token = await this.generateToken(
      { id: user!.id },
      envs.JWT_EXPIRE_IN
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  private async ensureUserExist(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
        status: true,
      },
    });

    if (!user) {
      throw CustomError.notFound('User not found');
    }
    return user;
  }

  private ensurePasswordIsCorrect(
    unHashedPassword: string,
    hashedPassword: string
  ) {
    const isMatch = encriptAdapter.compare(unHashedPassword, hashedPassword);

    if (!isMatch) {
      throw CustomError.unAutorized('Invalid credentials');
    }
  }

  private async generateToken(payload: any, duration: string) {
    const token = await JwtAdapter.generateToken(payload, duration);
    if (!token) throw CustomError.internalServer('Error while creating JWT');
    return token;
  }
}
