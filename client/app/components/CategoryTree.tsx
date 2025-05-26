import { Tree } from '@mantine/core';
import { useCategoryStore } from '../stores/categoryStore';

export const CategoryTree = () => {
	const { categories } = useCategoryStore();

	const renderTree = (nodes: Category[]) =>
		nodes.map((node) => (
			<Tree.Node key={node.id} label={node.name}>
				{node.children && renderTree(node.children)}
			</Tree.Node>
		));

	return <Tree>{renderTree(categories)}</Tree>;
};
