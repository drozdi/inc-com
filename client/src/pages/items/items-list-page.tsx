import {
	useItemDelete,
	useItemsQuery,
} from '@/entities/item';
import { Template } from '@/layouts';
import {
	ActionIcon,
	Anchor,
	Button,
	Group,
	Loader,
	Table,
	Text,
} from '@mantine/core';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { Link } from 'react-router-dom';

export function ItemsListPage() {
	const { data, isLoading } = useItemsQuery();
	const deleteMutation = useItemDelete();
	const items = data?.items ?? [];

	async function handleDelete(id: number) {
		await deleteMutation.mutateAsync(id);
	}

	return (
		<>
			<Template.Title>Товары</Template.Title>
			<Group justify="flex-end" mb="md">
				<Button component={Link} to="/items/new">
					Создать товар
				</Button>
			</Group>
			{isLoading ? (
				<Loader />
			) : items.length ? (
				<Table striped highlightOnHover withTableBorder>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Название</Table.Th>
							<Table.Th>Ед. изм.</Table.Th>
							<Table.Th>Описание</Table.Th>
							<Table.Th w={80} />
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{items.map((item) => (
							<Table.Tr key={item.id}>
								<Table.Td>
									<Anchor component={Link} to={`/items/${item.id}`}>
										{item.name}
									</Anchor>
								</Table.Td>
								<Table.Td>{item.unit ?? '—'}</Table.Td>
								<Table.Td>{item.description ?? '—'}</Table.Td>
								<Table.Td>
									<Group gap={4}>
										<ActionIcon
											component={Link}
											to={`/items/${item.id}`}
											variant="subtle"
										>
											<TbPencil />
										</ActionIcon>
										<ActionIcon
											color="red"
											variant="subtle"
											onClick={() => handleDelete(item.id)}
											loading={deleteMutation.isPending}
										>
											<TbTrash />
										</ActionIcon>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			) : (
				<Text c="dimmed">Товаров нет</Text>
			)}
		</>
	);
}
