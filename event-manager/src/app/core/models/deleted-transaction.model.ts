import { TransactionModel } from './transaction.model';

export interface DeletedTransaction {
  transaction: TransactionModel;
  index: number;
}