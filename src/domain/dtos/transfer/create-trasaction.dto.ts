export class CreateTransactionDTO {
  constructor(
    public sender_id: string,
    public receiver_id: string,
    public amount: number
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, CreateTransactionDTO?] {
    const { sender_id, receiver_id, amount } = object;

    if (!sender_id) {
      return ['sender id is required', undefined];
    }

    if (!receiver_id) {
      return ['receiver id is required', undefined];
    }

    if (!amount) {
      return ['amount is required', undefined];
    }

    if (typeof sender_id !== 'string' || sender_id.trim() === '') {
      return ['sender id must be string', undefined];
    }

    if (typeof receiver_id !== 'string' || receiver_id.trim() === '') {
      return ['receiver id must be string', undefined];
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return ['amount must be a positive integer', undefined];
    }

    if (sender_id === receiver_id) {
      return ['you cannot transfer money to yourself', undefined];
    }

    return [
      undefined,
      new CreateTransactionDTO(sender_id, receiver_id, amount),
    ];
  }
}
