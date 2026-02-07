import { useEnumsTypeCategory } from '@/entites/inc-com';
import { CategotyAdd } from '@/features/category/add';
import { CategoryList } from '@/features/category/list';
import { SegmentedControl } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
export function CategoriesPage() {
	const { id } = useParams();
	//const account = useStoreAccounts().findById(Number(id));
	const enumsTypeCategory = useEnumsTypeCategory();
	const data = useMemo(
		() => enumsTypeCategory.dataSelect.filter((item) => !item.disabled),
		[enumsTypeCategory.dataSelect],
	);
	const [type, setType] = useState<string>(data[0]?.value as string);

	return (
		<>
			{/* <Text>Категории счета "{account?.label}"</Text> */}
			<SegmentedControl data={data} onChange={setType} w="100%" />
			<CategotyAdd mt="md" account_id={Number(id)} type={type} />
			<CategoryList mt="md" account_id={Number(id)} type={type} />
		</>
	);
}
