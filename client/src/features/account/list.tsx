import { ActionIcon, Card, Flex, Group, Menu, SimpleGrid, Text } from '@mantine/core';
import { TbAccessPoint, TbDots, TbPlus } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';
import { useEnumsTypeAccount } from '../../entites/account/hooks';
import { useStoreAccounts } from '../../entites/account/store';

export function AccountList() {
	const sa = useStoreAccounts();
	const { list } = sa;
	const types = useEnumsTypeAccount();
	async function handleDelete(account: IAccount) {
		await sa.delete(account.id);
	}
	return (
		<SimpleGrid cols={3}>
			{list.length ? (
				list.map((account) => (
					<Card key={account.id} padding="xl" shadow="xl" radius="xl">
						<Card.Section withBorder inheritPadding py="xs">
							<Group justify="space-between">
								<Text fw={500}>
									{account.label} ({types.findLabelByCode(account.type)}
									)
								</Text>
								<Menu withinPortal position="bottom-end" shadow="sm">
									<Menu.Target>
										<ActionIcon variant="subtle" color="gray">
											<TbDots />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item>Транзакции</Menu.Item>
										<Menu.Item>Категории</Menu.Item>
										<Menu.Item>Доход</Menu.Item>
										<Menu.Item>Расход</Menu.Item>
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
							to={`/account/${account.id}`}
							py="xs"
						>
							<Flex h={100} justify="center" align="center">
								<TbAccessPoint size={90} />
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
							<TbDots />
						</ActionIcon>
					</Group>
				</Card.Section>
				<Card.Section component={NavLink} to="/account/new" withBorder py="xs">
					<Flex h={100} justify="center" align="center">
						<TbPlus size={90} />
					</Flex>
				</Card.Section>
			</Card>
		</SimpleGrid>
	);
}
