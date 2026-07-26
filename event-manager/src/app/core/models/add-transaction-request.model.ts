export interface AddTransactionRequest {
  name: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
}