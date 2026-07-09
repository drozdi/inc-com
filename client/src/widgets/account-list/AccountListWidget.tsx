import {
	useAccountDelete,
	useAccountsQuery,
	useEnumsTypeAccount,
} from '@/entities/account';
import {
	ActionIcon,
	Card,
	Flex,
	Group,
	Loader,
	Menu,
	SimpleGrid,
	Text,
	alpha,
} from '@mantine/core';
import { TbDots, TbPlus } from 'react-icons/tb';
import { Link, NavLink } from 'react-router-dom';

export function AccountListWidget() {
	const { data, isLoading } = useAccountsQuery();
	const deleteMutation = useAccountDelete();
	const types = useEnumsTypeAccount();
	const accounts = data?.items ?? [];

	async function handleDelete(account: IAccount) {
		await deleteMutation.mutateAsync(account.id);
	}

	if (isLoading) {
		return <Loader />;
	}

	return (
		<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
			{accounts.length ? (
				accounts.map((account) => (
					<Card
						bg={account.color ? alpha(account.color, 0.5) : ''}
						key={account.id}
						padding="xl"
						shadow="xl"
						radius="xl"
					>
						<Card.Section withBorder inheritPadding py="xs">
							<Group justify="space-between">
								<Text fw={500}>
									{account.label} ({types.findLabelByCode(account.type)})
								</Text>
								<Menu withinPortal position="bottom-end" shadow="sm">
									<Menu.Target>
										<ActionIcon variant="subtle" color="gray">
											<TbDots />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item
											component={Link}
											to={`/accounts/${account.id}/transactions`}
										>
											Транзакции
										</Menu.Item>
										<Menu.Item
											component={Link}
											to={`/accounts/${account.id}/categories`}
										>
											Категории
										</Menu.Item>
										<Menu.Item
											component={Link}
											to={`/accounts/${account.id}/transactions/new?type=income`}
										>
											Доход
										</Menu.Item>
										<Menu.Item
											component={Link}
											to={`/accounts/${account.id}/transactions/new?type=expense`}
										>
											Расход
										</Menu.Item>
										<Menu.Item
											c="red"
											onClick={() => handleDelete(account)}
										>
											Удалить
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							</Group>
						</Card.Section>
						<Card.Section
							component={NavLink}
							to={`/accounts/${account.id}`}
							py="xs"
						>
							<Flex h={100} justify="center" align="center">
								<Text size="xl" fw={700}>
									{account.balance.toLocaleString('ru-RU', {
										minimumFractionDigits: 2,
									})}
								</Text>
							</Flex>
						</Card.Section>
					</Card>
				))
			) : (
				<Card padding="xl">
					<Card.Section inheritPadding py="xs">
						<Text>Нет активных счетов. Добавьте новый счёт.</Text>
					</Card.Section>
				</Card>
			)}
			<Card shadow="xl" radius="xl">
				<Card.Section withBorder inheritPadding py="xs">
					<Group justify="space-between">
						<Text fw={500}>Новый счёт</Text>
						<ActionIcon variant="subtle" color="gray">
							<TbPlus />
						</ActionIcon>
					</Group>
				</Card.Section>
				<Card.Section component={NavLink} to="/accounts/new" withBorder py="xs">
					<Flex h={100} justify="center" align="center">
						<TbPlus size={90} />
					</Flex>
				</Card.Section>
			</Card>
		</SimpleGrid>
	);
}
