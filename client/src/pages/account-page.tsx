import { useParams } from 'react-router-dom';
import { AccountForm } from '../features/account/form';

export function AccountPage() {
	const { id } = useParams();
	return <AccountForm id={Number(id)} />;
}
