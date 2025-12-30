import { NavLink } from '@mantine/core';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

type NavItem = {
	label: string;
	icon?: React.ReactNode;
	path: string;
	subItems?: { label: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
	{
		label: 'Продукты',
		path: '/products',
	},
	{
		label: 'Документы',
		path: '/documents',
	},
	{
		label: 'Отчеты',
		path: '/reports',
	},
];

export const MainMenu = () => {
	const location = useLocation();

	const isActive = useCallback(
		(path: string) => location.pathname === path,
		[location.pathname],
	);

	return navItems.map((nav) => (
		<NavLink
			component={Link}
			to={nav.path}
			key={nav.path}
			label={nav.label}
			active={isActive(nav.path)}
		/>
	));
};
