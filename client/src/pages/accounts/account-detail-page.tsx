import { useAccountQuery } from '@/entities/account';
import { AccountForm } from '@/features/account/form';
import { AccountParticipantsPanel } from '@/features/account-participants';
import { Template } from '@/layouts';
import { Divider, Loader, Stack } from '@mantine/core';
import { useParams } from 'react-router-dom';

export function AccountDetailPage() {
	const { id } = useParams();
	const accountId = Number(id);
	const { data: account, isLoading } = useAccountQuery(accountId);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<>
			<Template.Title>
				{account?.label ? `Счёт: ${account.label}` : 'Счёт'}
			</Template.Title>
			<Stack gap="lg">
				<AccountForm id={accountId} />
				{account?.isMaster && (
					<>
						<Divider />
						<AccountParticipantsPanel
							accountId={accountId}
							participants={account.participants ?? []}
						/>
					</>
				)}
			</Stack>
		</>
	);
}
