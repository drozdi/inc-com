import { useItemCategoryCreate } from '@/entities/item-category';
import { Template } from '@/layouts';
import { CategoryTreeWidget } from '@/widgets';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';

export function ItemCategoriesPage() {
	const createMutation = useItemCategoryCreate();

	const form = useForm({
		initialValues: { name: '' },
		validate: {
			name: isNotEmpty('Введите название'),
		},
	});

	async function handleAdd(values: { name: string }) {
		await createMutation.mutateAsync({
			name: values.name.trim(),
			parentId: null,
		});
		form.reset();
	}

	return (
		<>
			<Template.Title>Категории товаров</Template.Title>
			<Stack gap="lg">
				<form onSubmit={form.onSubmit(handleAdd)}>
					<Group align="flex-end" wrap="wrap">
						<TextInput
							label="Новая категория"
							placeholder="Название"
							style={{ flex: 1, minWidth: 200 }}
							{...form.getInputProps('name')}
						/>
						<Button type="submit" loading={createMutation.isPending}>
							Добавить
						</Button>
					</Group>
				</form>
				<CategoryTreeWidget />
			</Stack>
		</>
	);
}
