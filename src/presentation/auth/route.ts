import { Router } from 'express';
import { AuthController } from './controller';
import { UserService } from '../services/user.service';
import { EmailService } from '../common/services/email.service';
import { envs } from '../../config';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_MAIL
    );

    const userService = new UserService(emailService);
    const authController = new AuthController(userService);

    router.post('/register', authController.createUser);
    router.post('/login', authController.loginUser);

    return router;
  }
}
