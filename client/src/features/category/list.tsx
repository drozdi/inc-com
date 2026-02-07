import { useStoreCategories } from '@/entites/inc-com';
import { Stack, type StackProps } from '@mantine/core';
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
	const storeCategories = useStoreCategories();
	const arr = storeCategories.selectAccount(account_id);

	const categories = useMemo(
		() =>
			arr
				.filter((category) => category.type === type)
				.sort((a, b) => a.label.localeCompare(b.label)),
		[arr, type],
	);

	return (
		<Stack {...props}>
			{categories.map((category) => (
				<CategotyItem key={category.id} category={category} />
			))}
		</Stack>
	);
}
