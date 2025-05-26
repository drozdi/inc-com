import { Badge, Table } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useTransactionStore } from '../stores/transactionStore';

export const TransactionsPage = () => {
	const { accountId } = useParams();
	const { getTransactionsByAccount } = useTransactionStore();
	const transactions = getTransactionsByAccount(accountId!);

	return (
		<Table striped>
			<thead>
				<tr>
					<th>Date</th>
					<th>Type</th>
					<th>Amount</th>
					<th>Category</th>
					<th>Items</th>
				</tr>
			</thead>
			<tbody>
				{transactions.map((transaction) => (
					<tr key={transaction.id}>
						<td>{new Date(transaction.date).toLocaleDateString()}</td>
						<td>
							<Badge
								color={transaction.type === 'income' ? 'green' : 'red'}
							>
								{transaction.type}
							</Badge>
						</td>
						<td>${transaction.amount}</td>
						<td>{/* Здесь можно отобразить название категории */}</td>
						<td>
							{transaction.items.map((item) => (
								<div key={item.id}>
									{item.name} (${item.amount})
								</div>
							))}
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};
