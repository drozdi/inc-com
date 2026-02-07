import { useStoreAuth, useStoreUserProfile } from '@/entites/auth/stores';
import { Navigate } from 'react-router-dom';

export const SignOutPage = () => {
	const storeAuth = useStoreAuth();
	const storeUserProfile = useStoreUserProfile();
	storeAuth.logout();
	storeUserProfile.reset();
	return <Navigate to="/" />;
};
