import { ProtectedRoute } from '@/features/auth/protected-route';

import {

	AccountCreatePage,

	AccountDetailPage,

	AccountsListPage,

} from '@/pages/accounts';

import { SignInPage } from '@/pages/auth/sign-in-page';

import { SignOutPage } from '@/pages/auth/sign-out-page';

import { SignUpPage } from '@/pages/auth/sign-up-page';

import { CategoriesAccountPage } from '@/pages/categories/categories-account-page';

import { CategoriesPage } from '@/pages/categories/categories-page';

import { ItemCategoriesPage } from '@/pages/item-categories';

import { ItemFormPage, ItemsListPage } from '@/pages/items';

import { MainPage } from '@/pages/main-page';

import {

	TransactionCreatePage,
	LegacyTransactionCreateRedirect,

	TransactionEditPage,

	TransactionsListPage,

	TransferCreatePage,
	TransferEditPage,

} from '@/pages/transactions';

import { AuthLayout, MainLayout } from '@/layouts';

import { Navigate, Outlet, useParams, useRoutes } from 'react-router-dom';

function LegacyAccountRedirect() {
	const { id } = useParams();
	return <Navigate to={`/accounts/${id}`} replace />;
}

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

					path: 'accounts',

					element: <Outlet />,

					children: [

						{ path: '', element: <AccountsListPage /> },

						{ path: 'new', element: <AccountCreatePage /> },

						{ path: ':id', element: <AccountDetailPage /> },

						{

							path: ':id/transactions',

							element: <Outlet />,

							children: [

								{ path: '', element: <TransactionsListPage /> },

								{
									path: 'new',
									element: <LegacyTransactionCreateRedirect />,
								},

							],

						},

						{ path: ':id/transfers/new', element: <TransferCreatePage /> },

						{ path: ':id/categories', element: <CategoriesPage /> },

					],

				},

				{

					path: 'transactions',

					element: <Outlet />,

					children: [

						{ path: 'new', element: <TransactionCreatePage /> },

						{ path: ':id/edit', element: <TransactionEditPage /> },

					],

				},

				{

					path: 'transfers',

					element: <Outlet />,

					children: [

						{ path: ':id/edit', element: <TransferEditPage /> },

					],

				},

				{

					path: 'items',

					element: <Outlet />,

					children: [

						{ path: '', element: <ItemsListPage /> },

						{ path: 'new', element: <ItemFormPage /> },

						{ path: ':id', element: <ItemFormPage /> },

					],

				},

				{

					path: 'item-categories',

					element: <ItemCategoriesPage />,

				},

				{

					path: 'categories',

					element: <Outlet />,

					children: [

						{ path: '', element: <CategoriesAccountPage /> },

						{ path: ':id', element: <CategoriesPage /> },

					],

				},

				{ path: 'account', element: <Navigate to="/accounts" replace /> },

				{ path: 'account/new', element: <Navigate to="/accounts/new" replace /> },

				{
					path: 'account/:id',
					element: <LegacyAccountRedirect />,
				},

			],

		},

	]);

	return routesElement;

}

