import { AccountForm } from '@/features/account/form';
import { useParams } from 'react-router-dom';

export function AccountPage() {
	const { id } = useParams();
	return <AccountForm id={Number(id)} />;
}
