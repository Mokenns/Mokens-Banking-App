import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { CustomError } from '../../domain';
import { CreateTransactionDTO } from '../../domain/dtos/transfer/create-trasaction.dto';

export class TransactionController {
  constructor(private readonly transactionservice: TransactionService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: 'Something went very wrong!' });
  };

  createTransaction(req: Request, res: Response) {
    const [error, createTransactionDTO] = CreateTransactionDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.transactionservice
      .create(createTransactionDTO!)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res));
  }

  findAllTransactions = (req: Request, res: Response) => {
    this.transactionservice
      .findAll()
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res));
  };

  findOneTransaction = (req: Request, res: Response) => {
    const { id } = req.params;

    this.transactionservice
      .findOne(id)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res));
  };
}
