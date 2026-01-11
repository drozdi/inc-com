import {
	requestAccountCreate,
	requestAccountDelete,
	requestAccountList,
	requestAccountRead,
	requestAccountUpdate,
} from '../../api/request-account';
import { defaultAccount } from '../../default';
import { factoryQuery } from '../../utils/factory-query';

export const [
	useQueryAccountList,
	useQueryAccountRead,
	useQueryAccountCreate,
	useQueryAccountUpdate,
	useQueryAccountDelete,
] = factoryQuery<IAccount, IRequestList>(
	'account',
	defaultAccount,
	requestAccountList,
	requestAccountRead,
	requestAccountCreate,
	requestAccountUpdate,
	requestAccountDelete,
);
