import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccountType = 'personal' | 'shared';

interface Account {
	id: string;
	name: string;
	balance: number;
	type: AccountType;
	ownerId: string;
	users: string[];
}

interface AccountState {
	accounts: Account[];
	currentAccount: Account | null;
	createAccount: (account: Omit<Account, 'id' | 'balance'>) => void;
	updateAccount: (id: string, updates: Partial<Account>) => void;
	deleteAccount: (id: string) => void;
	selectAccount: (id: string) => void;
}

export const useAccountStore = create<AccountState>()(
	persist(
		(set) => ({
			accounts: [],
			currentAccount: null,
			createAccount: (account) => {
				const newAccount = {
					...account,
					id: crypto.randomUUID(),
					balance: 0,
				};
				set((state) => ({ accounts: [...state.accounts, newAccount] }));
			},
			updateAccount: (id, updates) => {
				set((state) => ({
					accounts: state.accounts.map((acc) =>
						acc.id === id ? { ...acc, ...updates } : acc,
					),
				}));
			},
			selectAccount: (id) => {
				set((state) => ({
					currentAccount: state.accounts.find((acc) => acc.id === id) || null,
				}));
			},
		}),
		{ name: 'accounts-storage' },
	),
);
