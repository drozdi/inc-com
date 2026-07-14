import { useItemCreate, useItemQuery, useItemUpdate } from '@/entities/item';
import {
	ITEM_CATEGORIES_ALL_PARAMS,
	useItemCategoriesQuery,
} from '@/entities/item-category';
import { defaultItem } from '@/entities/item/model/defaults';
import type { IItemCategory } from '@/entities/item-category/model/types';
import { Template } from '@/layouts';
import {
	Button,
	Group,
	Loader,
	MultiSelect,
	Stack,
	TextInput,
	Textarea,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ItemFormPage() {
	const { id } = useParams();
	const itemId =
		id && !Number.isNaN(Number(id)) ? Number(id) : undefined;
	const isEdit = itemId !== undefined && itemId > 0;
	const navigate = useNavigate();

	const { data: item, isLoading } = useItemQuery(itemId);
	const { data: categoriesData } = useItemCategoriesQuery(
		ITEM_CATEGORIES_ALL_PARAMS,
	);
	const createMutation = useItemCreate();
	const updateMutation = useItemUpdate();

	const categoryOptions = useMemo(
		() =>
			(categoriesData?.items ?? []).map((category: IItemCategory) => ({
				value: String(category.id),
				label: category.name,
			})),
		[categoriesData?.items],
	);

	const form = useForm({
		initialValues: {
			name: defaultItem.name,
			description: defaultItem.description ?? '',
			unit: defaultItem.unit ?? '',
			categoryIds: [] as string[],
		},
		validate: {
			name: isNotEmpty('Введите название'),
		},
	});

	useEffect(() => {
		if (item && isEdit) {
			form.setValues({
				name: item.name,
				description: item.description ?? '',
				unit: item.unit ?? '',
				categoryIds: item.categoryIds.map(String),
			});
		}
	}, [item, isEdit]);

	async function handleSubmit(values: typeof form.values) {
		const payload = {
			name: values.name,
			description: values.description || null,
			unit: values.unit || null,
			categoryIds: values.categoryIds.map(Number),
		};

		if (isEdit && itemId) {
			await updateMutation.mutateAsync({ id: itemId, ...payload });
		} else {
			await createMutation.mutateAsync(payload);
		}
		navigate('/items');
	}

	if (isEdit && isLoading) {
		return <Loader />;
	}

	return (
		<>
			<Template.Title>{isEdit ? 'Редактирование товара' : 'Новый товар'}</Template.Title>
			<Stack gap="md" maw={480}>
				<TextInput
					label="Название"
					required
					{...form.getInputProps('name')}
				/>
				<Textarea
					label="Описание"
					{...form.getInputProps('description')}
				/>
				<TextInput label="Ед. изм." {...form.getInputProps('unit')} />
				<MultiSelect
					label="Категории"
					data={categoryOptions}
					{...form.getInputProps('categoryIds')}
				/>
				<Group>
					<Button
						onClick={() => form.onSubmit(handleSubmit)()}
						loading={createMutation.isPending || updateMutation.isPending}
					>
						Сохранить
					</Button>
					<Button variant="default" onClick={() => navigate('/items')}>
						Отмена
					</Button>
				</Group>
			</Stack>
		</>
	);
}
