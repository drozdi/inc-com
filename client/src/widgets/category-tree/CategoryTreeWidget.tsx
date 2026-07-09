import { useItemCategoriesQuery } from '@/entities/item-category';
import { Loader, Stack, Text } from '@mantine/core';

interface CategoryTreeNodeProps {
	parentId: number | 'null';
	level?: number;
}

function CategoryTreeNode({ parentId, level = 0 }: CategoryTreeNodeProps) {
	const { data, isLoading } = useItemCategoriesQuery({
		parent: parentId,
		limit: 100,
		offset: 0,
	});

	const categories = data?.items ?? [];

	if (isLoading) {
		return <Loader size="sm" />;
	}

	if (!categories.length) {
		return null;
	}

	return (
		<Stack gap={4} pl={level * 16}>
			{categories.map((category) => (
				<div key={category.id}>
					<Text fw={level === 0 ? 600 : 400}>{category.name}</Text>
					{category.childrenCount > 0 && (
						<CategoryTreeNode parentId={category.id} level={level + 1} />
					)}
				</div>
			))}
		</Stack>
	);
}

export function CategoryTreeWidget() {
	return (
		<Stack gap="md">
			<CategoryTreeNode parentId="null" />
		</Stack>
	);
}
