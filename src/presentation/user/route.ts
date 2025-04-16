import { Router } from 'express';
import { UserController } from './controller';
import { UserService } from '../services/user.service';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { EmailService } from '../common/services/email.service';
import { envs } from '../../config';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_MAIL
    );
    const userService = new UserService(emailService);
    const userController = new UserController(userService);

    router.get('/validate-account/:token', userController.validateAccount);
    router.use(AuthMiddleware.protect);
    router.get('/:id', userController.findOneUser);

    return router;
  }
}
