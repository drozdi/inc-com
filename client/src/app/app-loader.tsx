import { useStoreAuth, useStoreUserProfile } from '@/entities/user';

import { useStoreAccounts } from '@/entities/account';

import { useStoreCategories } from '@/entities/transaction-category';

import { useQueryLoading } from '@/shared/hooks';

import { Loading } from '@/shared/ui';

import { useEffect } from 'react';



export function AppLoader({ children }: { children: React.ReactNode }) {

	const storeAccounts = useStoreAccounts();

	const storeCategories = useStoreCategories();

	const storeAuth = useStoreAuth();

	const storeUserProfile = useStoreUserProfile();

	const isLoading = useQueryLoading(

		storeAuth,

		storeUserProfile,

		storeAccounts,

		storeCategories,

	);

	storeAuth.load();

	useEffect(() => {

		if (storeAuth.isAuthenticated) {

			storeUserProfile.load(true);

			storeAccounts.load(true);

			storeCategories.load(true);

		} else {

			storeUserProfile.reset();

		}

	}, [storeAuth.isAuthenticated]);

	return (

		<Loading active={isLoading} keepMounted>

			{children}

		</Loading>

	);

}

