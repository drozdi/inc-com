import { createTemplateContext } from '../../shared/internal/utils';

export const [Template, useTemplateManager] = createTemplateContext();

Template.Title = ({
	children,
	...props
}: {
	children: React.ReactNode;
	[key: string]: any;
}) => {
	return <Template slot="title">{children}</Template>;
};

Template.Footer = ({ children }: { children: React.ReactNode }) => (
	<Template slot="footer">{children}</Template>
);

Template.Header = ({ children }: { children: React.ReactNode }) => (
	<Template slot="header">{children}</Template>
);
