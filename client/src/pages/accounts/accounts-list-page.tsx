import { Template } from '@/layouts';
import { AccountListWidget, BalanceSummaryWidget } from '@/widgets';

export function AccountsListPage() {
	return (
		<>
			<Template.Title>Счета</Template.Title>
			<BalanceSummaryWidget />
			<AccountListWidget />
		</>
	);
}
