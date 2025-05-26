import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
	id: string;
	email: string;
	name: string;
}

export interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (user: Omit<User, 'id'> & { password: string }) => Promise<void>;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			loading: false,
			error: null,
			login: async (email, password) => {
				// Реализация логина
			},
			register: async (user) => {
				// Реализация регистрации
			},
			logout: () => set({ user: null }),
		}),
		{ name: 'auth-storage' },
	),
);
