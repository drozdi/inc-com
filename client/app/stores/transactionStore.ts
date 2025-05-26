// stores/transactionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TransactionItem {
	id: string;
	name: string;
	amount: number;
	categoryId: string;
}

interface Transaction {
	id: string;
	accountId: string;
	type: 'income' | 'expense';
	amount: number;
	categoryId: string;
	date: string;
	items: TransactionItem[];
	createdBy: string;
}

interface TransactionState {
	transactions: Transaction[];
	addTransaction: (
		transaction: Omit<Transaction, 'id' | 'items'> & {
			items?: Omit<TransactionItem, 'id'>[];
		},
	) => void;
	updateTransaction: (id: string, updates: Partial<Transaction>) => void;
	deleteTransaction: (id: string) => void;
	getTransactionsByAccount: (accountId: string) => Transaction[];
}

export const useTransactionStore = create<TransactionState>()(
	persist(
		(set, get) => ({
			transactions: [],
			addTransaction: (transaction) => {
				const newTransaction = {
					...transaction,
					id: crypto.randomUUID(),
					items:
						transaction.items?.map((item) => ({
							...item,
							id: crypto.randomUUID(),
						})) || [],
				};
				set((state) => ({
					transactions: [...state.transactions, newTransaction],
				}));
			},
			updateTransaction: (id, updates) => {
				set((state) => ({
					transactions: state.transactions.map((t) =>
						t.id === id ? { ...t, ...updates } : t,
					),
				}));
			},
			deleteTransaction: (id) => {
				set((state) => ({
					transactions: state.transactions.filter((t) => t.id !== id),
				}));
			},
			getTransactionsByAccount: (accountId) => {
				return get().transactions.filter((t) => t.accountId === accountId);
			},
		}),
		{ name: 'transactions-storage' },
	),
);
