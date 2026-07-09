import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseQueryOptions,
} from '@tanstack/react-query';
import { defaultAccount } from '../model/defaults';
import {
	requestAccountCreate,
	requestAccountDelete,
	requestAccountList,
	requestAccountRead,
	requestAccountUpdate,
	requestAccountAddUser,
	requestAccountRemoveUser,
} from './account';

const ACCOUNTS_KEY = 'accounts';

export function useAccountsQuery(
	params: Partial<IRequestList> = { limit: 100, offset: 0 },
	options?: Omit<
		UseQueryOptions<IResponseList<IAccount>>,
		'queryKey' | 'queryFn'
	>,
) {
	return useQuery({
		queryKey: [ACCOUNTS_KEY, params],
		queryFn: () => requestAccountList(params),
		...options,
	});
}

export function useAccountQuery(id?: IAccount['id']) {
	return useQuery({
		queryKey: [ACCOUNTS_KEY, id],
		queryFn: () =>
			id ? requestAccountRead(id) : Promise.resolve(defaultAccount),
		enabled: !!id,
	});
}

export function useAccountCreate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Partial<IAccount>) => requestAccountCreate(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] });
		},
	});
}

export function useAccountUpdate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			...data
		}: Partial<IAccount> & { id: IAccount['id'] }) =>
			requestAccountUpdate(id, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] });
			queryClient.invalidateQueries({
				queryKey: [ACCOUNTS_KEY, variables.id],
			});
		},
	});
}

export function useAccountDelete() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: IAccount['id']) => requestAccountDelete(id),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] });
			queryClient.removeQueries({ queryKey: [ACCOUNTS_KEY, id] });
		},
	});
}

export function useAccountAddUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			login,
		}: {
			id: IAccount['id'];
			login: string;
		}) => requestAccountAddUser(id, { login }),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: [ACCOUNTS_KEY, variables.id],
			});
		},
	});
}

export function useAccountRemoveUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			userId,
		}: {
			id: IAccount['id'];
			userId: number;
		}) => requestAccountRemoveUser(id, userId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: [ACCOUNTS_KEY, variables.id],
			});
		},
	});
}
