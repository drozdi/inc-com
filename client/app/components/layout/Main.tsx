import { AppShell, Box, Burger, Group, Image, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconBook,
	IconChartPie3,
	IconCode,
	IconCoin,
	IconFingerprint,
	IconNotification,
} from '@tabler/icons-react';
import { Outlet } from 'react-router';
import Logo from '../../images/logo.svg';
import classes from './main.module.css';

const mockdata = [
	{
		icon: IconCode,
		title: 'Open source',
		description: 'This Pokémon’s cry is very loud and distracting',
	},
	{
		icon: IconCoin,
		title: 'Free for everyone',
		description: 'The fluid of Smeargle’s tail secretions changes',
	},
	{
		icon: IconBook,
		title: 'Documentation',
		description: 'Yanma is capable of seeing 360 degrees without',
	},
	{
		icon: IconFingerprint,
		title: 'Security',
		description: 'The shell’s rounded shape and the grooves on its.',
	},
	{
		icon: IconChartPie3,
		title: 'Analytics',
		description: 'This Pokémon uses its flying ability to quickly chase',
	},
	{
		icon: IconNotification,
		title: 'Notifications',
		description: 'Combusken battles with the intensely hot flames it spews',
	},
];

export default () => {
	const [opened, { toggle }] = useDisclosure();

	const links = mockdata.map((item) => (
		<UnstyledButton className={classes.control} key={item.title}>
			{item.title}
		</UnstyledButton>
	));
	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: 'sm',
				collapsed: { desktop: true, mobile: !opened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Group h="100%" justify="space-between" style={{ flex: 1 }}>
						<Box component="a" h="100%">
							<Image mah="100%" src={Logo} />
						</Box>
						<Group ml="xl" gap={0} visibleFrom="sm">
							{links}
						</Group>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar py="md" px={4}>
				{links}
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
};
