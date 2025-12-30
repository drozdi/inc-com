import { useRoutes } from 'react-router-dom';
import { MainPage } from '../pages/main-page';

export function AppRouters() {
	const routesElement = useRoutes([
		{
			path: '/',
			element: <MainPage />,
		},
	]);
	return routesElement;
}
