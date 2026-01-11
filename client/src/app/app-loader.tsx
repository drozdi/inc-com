import { useEffect } from 'react';
import { useStoreAccounts, useStoreCategories } from '../entites/account';
import { useQueryLoading } from '../shared/hooks';
import { Loading } from '../shared/ui';

export function AppLoader({ children }: { children: React.ReactNode }) {
	const storeAccounts = useStoreAccounts();
	const storeCategories = useStoreCategories();
	const isLoading = useQueryLoading(storeAccounts, storeCategories);
	useEffect(() => {
		storeAccounts.fetch();
		storeCategories.fetch();
	}, []);

	return (
		<Loading active={isLoading} keepMounted>
			{children}
		</Loading>
	);
}
