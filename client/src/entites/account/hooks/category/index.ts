import {
	requestCategoryCreate,
	requestCategoryDelete,
	requestCategoryList,
	requestCategoryRead,
	requestCategoryUpdate,
} from '../../api/request-category';
import { defaultCategory } from '../../default';
import { factoryQuery } from '../../utils/factory-query';

export const [
	useQueryCategoryList,
	useQueryCategoryRead,
	useQueryCategoryCreate,
	useQueryCategoryUpdate,
	useQueryCategoryDelete,
] = factoryQuery<ICategory, IRequestList>(
	'category',
	defaultCategory,
	requestCategoryList,
	requestCategoryRead,
	requestCategoryCreate,
	requestCategoryUpdate,
	requestCategoryDelete,
);
