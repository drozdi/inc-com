interface IAccount {
	id: number;
	x_timestamp: string;
	owner: string;
	owner_id: number;
	sort: number;
	label: string;
	balance: number;
	type: string;
	color: string;
	icon: string;
}

interface ICategory {
	id: number;
	x_timestamp: string;
	owner: string;
	owner_id: number;
	account_id: number;
	sort: number;
	label: string;
	type: string;
	mcc: number;
}

interface ITransaction {
	id: number;
	x_timestamp: string;
	owner: string;
	owner_id: number;
	account_id: number;
	sort: number;
	label: string;
	type: string;
	mcc: number;
}

interface IStoreAccount extends IStore<IAccount> {}

interface IStoreCategory extends IStore<ICategory> {
	selectAccount: (account_id: ICategory['account_id']) => ICategory[];
	findLabelById: (id: ICategory['id']) => ICategory['label'];
}

interface IStoreTransaction extends IStore<ITransaction> {}
