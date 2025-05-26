import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
	index('pages/home.tsx'),
	layout('components/layout/Root.tsx', [
		route('sign-in', 'pages/auth/sign-in/sign-in.tsx'),
		//route('sign-up', 'pages/auth/sign-up/sign-up.tsx'),
	]),
] satisfies RouteConfig;
