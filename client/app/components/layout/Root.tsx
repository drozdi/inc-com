import { Outlet } from 'react-router';
import { NavBar } from '../NavBar';
export default () => {
	return (
		<>
			<NavBar />
			<main>
				<Outlet />
			</main>
		</>
	);
};
