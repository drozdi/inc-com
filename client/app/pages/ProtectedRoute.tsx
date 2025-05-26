import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const { user } = useAuthStore();
	if (!user) return <Navigate to="/login" replace />;
	return children;
};
