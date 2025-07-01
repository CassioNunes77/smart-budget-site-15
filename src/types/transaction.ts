export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  /**
   * Optional status flags – when absent, the value is considered confirmed.
   *  - income:  received / unreceived
   *  - expense: paid / unpaid
   */
  status?: 'paid' | 'unpaid' | 'received' | 'unreceived';
  /** Timestamp (ISO) indicating when the record was created in the system */
  createdAt?: string;
  /** Recurring transaction flags */
  isRecurring?: boolean;
  recurringFrequency?: 'monthly' | 'weekly' | 'yearly';
  /** Last month (yyyy-mm) that the recurrence should be generated */
  recurringEndDate?: string;
}