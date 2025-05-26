// stores/categoryStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Category {
	id: string;
	name: string;
	parentId: string | null;
	accountId: string;
	type: 'income' | 'expense' | 'product';
}

interface CategoryState {
	categories: Category[];
	currentAccountId: string | null;
	setCurrentAccount: (accountId: string) => void;
	addCategory: (category: Omit<Category, 'id'>) => void;
	updateCategory: (id: string, updates: Partial<Category>) => void;
	deleteCategory: (id: string) => void;
	getCategoriesTree: (type?: Category['type']) => Category[];
}

export const useCategoryStore = create<CategoryState>()(
	persist(
		(set, get) => ({
			categories: [],
			currentAccountId: null,
			setCurrentAccount: (accountId) => set({ currentAccountId: accountId }),
			addCategory: (category) => {
				const newCategory = { ...category, id: crypto.randomUUID() };
				set((state) => ({ categories: [...state.categories, newCategory] }));
			},
			updateCategory: (id, updates) => {
				set((state) => ({
					categories: state.categories.map((cat) =>
						cat.id === id ? { ...cat, ...updates } : cat,
					),
				}));
			},
			deleteCategory: (id) => {
				set((state) => ({
					categories: state.categories.filter((cat) => cat.id !== id),
				}));
			},
			getCategoriesTree: (type) => {
				const { categories, currentAccountId } = get();
				return buildTree(
					categories.filter(
						(cat) =>
							cat.accountId === currentAccountId &&
							(type ? cat.type === type : true),
					),
				);
			},
		}),
		{ name: 'categories-storage' },
	),
);

// Вспомогательная функция для построения дерева
const buildTree = (categories: Category[]): Category[] => {
	const map = new Map(categories.map((cat) => [cat.id, cat]));
	const tree: Category[] = [];

	for (const category of categories) {
		if (category.parentId) {
			const parent = map.get(category.parentId);
			if (parent) {
				parent.children = [...(parent.children || []), category];
			}
		} else {
			tree.push(category);
		}
	}
	return tree;
};
