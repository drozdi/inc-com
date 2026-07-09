export interface ApiTransactionCategory {
	id: number;
	name: string;
	type?: string;
	accountId?: number;
	createdById?: number;
	createdAt?: string;
	updatedAt?: string;
}
