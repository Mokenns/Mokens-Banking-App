import { Router } from 'express';
import { TransactionController } from './controller';
import { TransactionService } from '../services/transaction.service';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';

export class TransferRoutes {
  static get routes(): Router {
    const router = Router();

    const transactionService = new TransactionService();
    const transactionController = new TransactionController(transactionService);

    router.use(AuthMiddleware.protect);
    router.post(
      '/',
      transactionController.createTransaction.bind(transactionController)
    );
    router.get(
      '/',
      transactionController.findAllTransactions.bind(transactionController)
    );
    router.get(
      '/:id',
      transactionController.findOneTransaction.bind(transactionController)
    );

    return router;
  }
}
