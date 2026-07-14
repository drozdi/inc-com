import {
	buildTransactionCategoriesQueryParams,
	useTransactionCategoriesQuery,
} from '@/entities/transaction-category';
import { Stack, Loader, type StackProps } from '@mantine/core';
import { useMemo } from 'react';
import { CategotyItem } from './item';

export function CategoryList({
	account_id,
	type,
	...props
}: StackProps & {
	account_id: ICategory['account_id'];
	type: string;
}) {
	const { data, isLoading } = useTransactionCategoriesQuery(
		buildTransactionCategoriesQueryParams(account_id),
		{ enabled: Boolean(account_id) && !Number.isNaN(account_id) },
	);

	const categories = useMemo(
		() =>
			(data?.items ?? [])
				.filter((category) => category.type === type)
				.sort((a, b) => a.label.localeCompare(b.label)),
		[data?.items, type],
	);

	if (isLoading) {
		return <Loader size="sm" />;
	}

	return (
		<Stack {...props}>
			{categories.map((category) => (
				<CategotyItem key={category.id} category={category} />
			))}
		</Stack>
	);
}
