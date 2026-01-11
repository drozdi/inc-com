import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';
import { queryClient } from '../../../shared/api/query-client';
import {
	requestAccountCreate,
	requestAccountDelete,
	requestAccountList,
	requestAccountUpdate,
} from '../api';

// Define a collection that loads data using TanStack Query
export const collectionAccount = createCollection(
	queryCollectionOptions<IAccount>({
		queryClient,
		queryKey: ['account'],
		queryFn: async (...args) => {
			console.log('queryFn', args);
			return (await requestAccountList({})).items;
		},
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0];
			await requestAccountCreate(modified);
		},
		onUpdate: async ({ transaction }) => {
			const { original, modified } = transaction.mutations[0];
			await requestAccountUpdate(original.id, modified);
		},
		onDelete: async ({ transaction }) => {
			const { original } = transaction.mutations[0];
			await requestAccountDelete(original.id);
		},
	}),
);
