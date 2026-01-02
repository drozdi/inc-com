import {
	ActionIcon,
	AppShell,
	Burger,
	Container,
	Divider,
	Group,
	ScrollArea,
} from '@mantine/core';
import { TbArrowBarLeft, TbArrowBarRight } from 'react-icons/tb';
import { Outlet, useNavigate } from 'react-router-dom';
import { $setting } from '../shared';
import { Title } from '../shared/ui';

import { MainMenu } from './components/main-menu';
import { ThemeBtn } from './components/theme-btn';
import { Template } from './context';

export function MainLayout() {
	const navigate = useNavigate();
	const [mobileOpened, { toggle: toggleMobile }] = $setting.useDisclosure(
		'mobileOpened',
		false,
	);
	const [desktopOpened, { toggle: toggleDesktop }] = $setting.useDisclosure(
		'desktopOpened',
		true,
	);
	return (
		<>
			<AppShell
				layout="alt"
				header={{ height: { base: 60, md: 70, lg: 80 } }}
				footer={{ height: 60 }}
				navbar={{
					width: { base: 200, md: 300 },
					breakpoint: 'sm',
					collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
				}}
			>
				<AppShell.Header>
					<Group h="100%" px="md" justify="space-between">
						<Group h="100%" flex="1">
							<Burger
								opened={mobileOpened}
								onClick={toggleMobile}
								hiddenFrom="sm"
								size="sm"
							/>
							<ActionIcon
								onClick={toggleDesktop}
								visibleFrom="sm"
								variant="default"
							>
								{desktopOpened ? <TbArrowBarLeft /> : <TbArrowBarRight />}
							</ActionIcon>
							<Divider orientation="vertical" />
							<Group flex="1">
								<Template.Slot name="header">
									<Template.Slot name="title" />
								</Template.Slot>
							</Group>
						</Group>
						<Group h="100%">
							<ThemeBtn />
						</Group>
					</Group>
				</AppShell.Header>
				<AppShell.Navbar>
					<AppShell.Section p="xs">
						<Burger
							opened={mobileOpened}
							onClick={toggleMobile}
							hiddenFrom="sm"
							size="sm"
						/>
					</AppShell.Section>
					<AppShell.Section grow my="xs" component={ScrollArea} px="xs">
						<MainMenu />
					</AppShell.Section>
					<AppShell.Section p="xs"></AppShell.Section>
				</AppShell.Navbar>
				<AppShell.Main>
					<Container size="xl" p="xs">
						{/* <Template.Slot name='notification' /> */}
						<Outlet />
					</Container>
				</AppShell.Main>
				<AppShell.Footer<Group>
					component={Group}
					justify="space-between"
					gap="xs"
					px="xs"
				>
					<Template.Slot name="footer">
						<div></div>
					</Template.Slot>
				</AppShell.Footer>
			</AppShell>
		</>
	);
}
