import { AccountForm } from '@/features/account/form';
import { Template } from '@/layouts';

export function AccountCreatePage() {
	return (
		<>
			<Template.Title>Новый счёт</Template.Title>
			<AccountForm />
		</>
	);
}
