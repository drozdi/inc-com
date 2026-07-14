import {
	buildItemCategoriesChildParams,
	useItemCategoriesQuery,
	useItemCategoryCreate,
	useItemCategoryDelete,
	useItemCategoryUpdate,
} from '@/entities/item-category';
import type { IItemCategory } from '@/entities/item-category/model/types';
import {
	ActionIcon,
	Group,
	Loader,
	Stack,
	TagsInput,
	Text,
	TextInput,
	Tooltip,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useMemo, useState } from 'react';
import { TbCheck, TbPencil, TbPlus, TbTrash, TbX } from 'react-icons/tb';

interface CategoryFormValues {
	name: string;
	keywords: string[];
}

interface AddChildFormProps {
	parentId: number;
	onDone: () => void;
}

function AddChildForm({ parentId, onDone }: AddChildFormProps) {
	const createMutation = useItemCategoryCreate();
	const form = useForm<CategoryFormValues>({
		initialValues: { name: '', keywords: [] },
		validate: { name: isNotEmpty('Введите название') },
	});

	async function handleAdd(values: CategoryFormValues) {
		await createMutation.mutateAsync({
			name: values.name.trim(),
			parentId,
			keywords: values.keywords.map((word) => word.trim()).filter(Boolean),
		});
		form.reset();
		onDone();
	}

	return (
		<form onSubmit={form.onSubmit(handleAdd)}>
			<Stack gap="xs" pl={24}>
				<Group align="flex-end" wrap="nowrap">
					<TextInput
						label="Подкатегория"
						placeholder="Название"
						style={{ flex: 1 }}
						{...form.getInputProps('name')}
					/>
					<ActionIcon
						type="submit"
						color="green"
						loading={createMutation.isPending}
						aria-label="Сохранить"
					>
						<TbCheck />
					</ActionIcon>
					<ActionIcon onClick={onDone} aria-label="Отмена">
						<TbX />
					</ActionIcon>
				</Group>
				<TagsInput
					label="Ключевые слова"
					placeholder="Введите слово и нажмите Enter"
					{...form.getInputProps('keywords')}
				/>
			</Stack>
		</form>
	);
}

interface CategoryTreeNodeProps {
	parentId: number | 'null';
	level?: number;
}

function CategoryTreeNode({ parentId, level = 0 }: CategoryTreeNodeProps) {
	const queryParams = useMemo(
		() =>
			parentId === 'null'
				? { parent: 'null' as const, limit: 100, offset: 0 }
				: buildItemCategoriesChildParams(parentId),
		[parentId],
	);
	const { data, isLoading } = useItemCategoriesQuery(queryParams);
	const categories = data?.items ?? [];

	if (isLoading) {
		return <Loader size="sm" />;
	}

	if (!categories.length) {
		return null;
	}

	return (
		<Stack gap="xs" pl={level * 16}>
			{categories.map((category) => (
				<CategoryRow key={category.id} category={category} level={level} />
			))}
		</Stack>
	);
}

function CategoryKeywords({ keywords }: { keywords: string[] }) {
	if (!keywords.length) {
		return null;
	}

	return (
		<Text size="xs" c="dimmed">
			Ключевые слова: {keywords.join(', ')}
		</Text>
	);
}

function CategoryRow({
	category,
	level,
}: {
	category: IItemCategory;
	level: number;
}) {
	const [isEdit, setIsEdit] = useState(false);
	const [showAddChild, setShowAddChild] = useState(false);
	const updateMutation = useItemCategoryUpdate();
	const deleteMutation = useItemCategoryDelete();

	const form = useForm<CategoryFormValues>({
		initialValues: {
			name: category.name,
			keywords: category.keywords ?? [],
		},
		validate: { name: isNotEmpty('Введите название') },
	});

	async function handleSave(values: CategoryFormValues) {
		await updateMutation.mutateAsync({
			id: category.id,
			name: values.name.trim(),
			keywords: values.keywords.map((word) => word.trim()).filter(Boolean),
		});
		setIsEdit(false);
	}

	async function handleDelete() {
		await deleteMutation.mutateAsync(category.id);
	}

	function startEdit() {
		form.setValues({
			name: category.name,
			keywords: category.keywords ?? [],
		});
		setIsEdit(true);
	}

	return (
		<Stack gap="xs">
			{isEdit ? (
				<form onSubmit={form.onSubmit(handleSave)}>
					<Stack gap="xs">
						<Group align="flex-end" wrap="nowrap">
							<TextInput
								label="Название"
								style={{ flex: 1 }}
								{...form.getInputProps('name')}
							/>
							<ActionIcon
								type="submit"
								color="green"
								loading={updateMutation.isPending}
								aria-label="Сохранить"
							>
								<TbCheck />
							</ActionIcon>
							<ActionIcon onClick={() => setIsEdit(false)} aria-label="Отмена">
								<TbX />
							</ActionIcon>
						</Group>
						<TagsInput
							label="Ключевые слова"
							placeholder="Введите слово и нажмите Enter"
							{...form.getInputProps('keywords')}
						/>
					</Stack>
				</form>
			) : (
				<Stack gap={2}>
					<Group justify="space-between" wrap="nowrap">
						<Text fw={level === 0 ? 600 : 400}>{category.name}</Text>
						<Group gap={4} wrap="nowrap">
							<Tooltip label="Редактировать">
								<ActionIcon
									variant="subtle"
									onClick={startEdit}
									aria-label="Редактировать"
								>
									<TbPencil />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Добавить подкатегорию">
								<ActionIcon
									variant="subtle"
									onClick={() => setShowAddChild((value) => !value)}
									aria-label="Добавить подкатегорию"
								>
									<TbPlus />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Удалить">
								<ActionIcon
									variant="subtle"
									color="red"
									onClick={handleDelete}
									loading={deleteMutation.isPending}
									aria-label="Удалить"
								>
									<TbTrash />
								</ActionIcon>
							</Tooltip>
						</Group>
					</Group>
					<CategoryKeywords keywords={category.keywords ?? []} />
				</Stack>
			)}
			{showAddChild && (
				<AddChildForm
					parentId={category.id}
					onDone={() => setShowAddChild(false)}
				/>
			)}
			{category.childrenCount > 0 && (
				<CategoryTreeNode parentId={category.id} level={level + 1} />
			)}
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
