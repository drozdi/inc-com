import { createRoot } from 'react-dom/client';
import { AppLoader } from './app/app-loader';
import { AppProvider } from './app/app-provider';
import { AppRouters } from './app/app-routes';
import './shared/index.css';

createRoot(document.getElementById('root')!).render(
	<AppProvider>
		<AppLoader>
			<AppRouters />
		</AppLoader>
	</AppProvider>,
);
