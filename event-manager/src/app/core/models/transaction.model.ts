export type TransactionType = 'income' | 'expense';

export interface TransactionModel {

  id: string;

  eventId: string;

  name: string;

  description: string;

  type: TransactionType;

  amount: number;

  createdAt: string;
}