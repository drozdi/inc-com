import { useStoreUserProfile } from '@/entites/auth';
import { useStoreAccounts } from '@/entites/inc-com';
import { currencyFormat } from '@/shared/utils/currency-format';
import { Avatar, NavLink, Stack, Text, alpha } from '@mantine/core';
import { TbAccessPoint } from 'react-icons/tb';
import { Link } from 'react-router-dom';

function Item({ account }: { account: IAccount }) {
	const { userData } = useStoreUserProfile();
	return (
		<NavLink
			bg={account.color ? alpha(account.color, 0.5) : ''}
			component={Link}
			to={`/categories/${account.id}`}
			leftSection={
				<Avatar color="cyan" radius="xl">
					<TbAccessPoint size={90} />
				</Avatar>
			}
			label={
				<div>
					<Text fz="xs" tt="uppercase" fw={700} c="dimmed">
						{account.owner_id === userData?.id ? 'Мой' : account.owner}
					</Text>
					<Text fz="xl">{account.label}</Text>
					<Text fz="md">{currencyFormat(account.balance)}</Text>
				</div>
			}
		></NavLink>
	);
}

export function CategoriesAccount() {
	const storeAccounts = useStoreAccounts();
	return (
		<Stack>
			{storeAccounts.list.map((item) => (
				<Item key={item.id} account={item} />
			))}
		</Stack>
	);
}
