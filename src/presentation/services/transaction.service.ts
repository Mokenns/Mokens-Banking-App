import { Transaction } from '../../data/postgres/models/transaction';
import { User } from '../../data/postgres/models/user';
import { CreateTransactionDTO } from '../../domain/dtos/transfer/create-trasaction.dto';
import { CustomError } from '../../domain';

export class TransactionService {
  async create(data: CreateTransactionDTO) {
    const { sender_id, receiver_id, amount } = data;

    // Buscar emisor y receptor
    const sender = await User.findOne({
      where: { id: sender_id, status: true },
    });
    const receiver = await User.findOne({
      where: { id: receiver_id, status: true },
    });

    if (!sender) {
      throw CustomError.notFound('Sender user not found or inactive');
    }

    if (!receiver) {
      throw CustomError.notFound('Receiver user not found or inactive');
    }

    if (Number(sender.balance) < Number(amount)) {
      throw CustomError.badRequest('Insufficient balance');
    }

    sender.balance = Number(sender.balance) - Number(amount);
    receiver.balance = Number(receiver.balance) + Number(amount);

    try {
      await sender.save();
      await receiver.save();

      const transaction = new Transaction();
      transaction.sender_id = sender_id;
      transaction.receiver_id = receiver_id;
      transaction.amount = amount;

      return await transaction.save();
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer('Transfer failed');
    }
  }

  async findAll() {
    try {
      const transaction = await Transaction.find({});
      return transaction;
    } catch (error) {
      throw CustomError.internalServer('Error fetching Transaction');
    }
  }

  async findOne(id: string) {
    const transaction = await Transaction.findOne({
      where: {
        id: id,
      },
    });

    if (!transaction) {
      throw CustomError.notFound('Transfer not found');
    }
    return transaction;
  }
}
