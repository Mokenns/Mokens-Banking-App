import { Router } from 'express';
import { UserRoutes } from './user/route';
import { TransferRoutes } from './transfer/route';
import { AuthRoutes } from './auth/route';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/users', UserRoutes.routes);
    router.use('/api/transactions', TransferRoutes.routes);
    router.use('/api/auth', AuthRoutes.routes);

    return router;
  }
}
