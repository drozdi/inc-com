import { ProtectedRoute } from '@/features/auth/protected-route';
import { AccountPage } from '@/pages/account/account-page';
import { AccountsPage } from '@/pages/account/accounts-page';
import { CategoriesAccountPage } from '@/pages/categoty/categories-account-page';
import { CategoriesPage } from '@/pages/categoty/categories-page';
import { MainPage } from '@/pages/main-page';
import { AuthLayout, MainLayout } from '@t';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { SignInPage } from '../pages/auth/sign-in-page';
import { SignOutPage } from '../pages/auth/sign-out-page';
import { SignUpPage } from '../pages/auth/sign-up-page';

export function AppRouters() {
	const routesElement = useRoutes([
		{
			path: '/auth',
			element: <AuthLayout />,
			children: [
				{
					path: '',
					element: <Navigate to="/auth/sign-in" />,
				},
				{
					path: 'sign-in',
					element: <SignInPage />,
				},
				{
					path: 'sign-up',
					element: <SignUpPage />,
				},
				{
					path: 'sign-out',
					element: <SignOutPage />,
				},
			],
		},
		{
			path: '/',
			element: (
				<ProtectedRoute>
					<MainLayout />
				</ProtectedRoute>
			),
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
				{
					path: 'categories',
					element: <Outlet />,
					children: [
						{ path: '', element: <CategoriesAccountPage /> },
						{ path: ':id', element: <CategoriesPage /> },
					],
				},
			],
		},
	]);
	return routesElement;
}
