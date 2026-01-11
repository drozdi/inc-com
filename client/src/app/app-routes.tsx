import { Outlet, useRoutes } from 'react-router-dom';
import { MainLayout } from '../layout';
import { AccountPage } from '../pages/account-page';
import { AccountsPage } from '../pages/accounts-page';
import { MainPage } from '../pages/main-page';

export function AppRouters() {
	const routesElement = useRoutes([
		{
			path: '/',
			element: <MainLayout />,
			children: [
				{
					path: '',
					element: <MainPage />,
				},
				{
					path: 'account',
					element: <Outlet />,
					children: [
						{ path: '', element: <AccountsPage /> },
						{ path: 'new', element: <AccountPage /> },
						{ path: ':id', element: <AccountPage /> },
					],
				},
			],
		},
	]);
	return routesElement;
}
