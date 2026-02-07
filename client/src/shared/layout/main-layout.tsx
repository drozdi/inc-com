import { InOutLink } from '@/features/auth/in-out-link';
import { PersonalLink } from '@/features/lk/personal-link';
import {
	ActionIcon,
	AppShell,
	Burger,
	Button,
	Container,
	Divider,
	Group,
	ScrollArea,
} from '@mantine/core';
import { useMemo } from 'react';
import { TbArrowBarLeft, TbArrowBarRight } from 'react-icons/tb';
import { Outlet, useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../hooks';
import { $setting } from '../setting';
import { Title } from '../ui';
import { MainMenu } from './components/main-menu';
import { ThemeBtn } from './components/theme-btn';
import { Template } from './store';

export function MainLayout() {
	const navigate = useNavigate();
	const breakpoint = useBreakpoint('sm');
	const back = useMemo<boolean>(() => {
		return false || window?.history?.state?.idx > 0;
	}, [window?.history?.state?.idx]);
	const [mobileOpened, { toggle: toggleMobile }] = $setting.useDisclosure(
		'layout.mobile',
		false,
	);
	const [desktopOpened, { toggle: toggleDesktop }] = $setting.useDisclosure(
		'layout.desktop',
		false,
	);
	return (
		<AppShell
			layout="alt"
			header={{ height: { base: 60, md: 70, lg: 80 } }}
			footer={{ height: 60 }}
			navbar={{
				width: desktopOpened ? 300 : 64,
				breakpoint: 'sm',
				collapsed: {
					mobile: !mobileOpened,
				},
			}}
		>
			<AppShell.Header>
				<Group h="100%" px="md" justify="space-between">
					<Group>
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
						<Title order={1} size="h3" fw="400">
							<Template.Slot name="title" />
						</Title>
					</Group>
					<Template.Slot name="header">default header</Template.Slot>
					<Group>
						<PersonalLink />
						<InOutLink />
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
					<MainMenu mini={!breakpoint && !desktopOpened} />
				</AppShell.Section>
				<AppShell.Section p="xs"></AppShell.Section>
			</AppShell.Navbar>
			<AppShell.Main>
				<ScrollArea
					h={`calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))`}
				>
					<Container size="xl" p="md">
						<Outlet />
					</Container>
				</ScrollArea>
			</AppShell.Main>
			<AppShell.Footer component={Group} justify="space-between" gap="xs" px="xs">
				<Template.Slot name="footer">
					<div></div>
				</Template.Slot>
				<Button
					color="dark"
					size="sm"
					disabled={!back}
					onClick={() => navigate(-1)}
				>
					Назад
				</Button>
			</AppShell.Footer>
		</AppShell>
	);
}

// import { ActionIcon, AppShell, Burger, Button, Container, Divider, Group, ScrollArea } from '@mantine/core'
// import { useDisclosure } from '@mantine/hooks'
// import { useMemo } from 'react'
// import { TbArrowBarLeft, TbArrowBarRight } from 'react-icons/tb'
// import { Outlet, useNavigate } from 'react-router-dom'
// import { ShopCartBtn } from '../apps/shop/features/shop-cart-btn'
// import { ShopCartDrawer } from '../apps/shop/widgets/shop-cart-drawer'
// import { InOutLink } from '../features/auth/in-out-link'
// import { ChangeProduct } from '../features/lk/change-product'
// import { PersonalLink } from '../features/lk/personal-link'
// import { Logo } from '../features/logo/Logo'
// import { Title } from '../shared/ui'
// import { MainMenu } from './components/main-menu'
// import { ThemeBtn } from './components/theme-btn'
// import { Template } from './context'

// export function MainLayout() {
// 	const navigate = useNavigate()
// 	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
// 	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
// 	const back = useMemo<boolean>(() => {
// 		return false || window?.history?.state?.idx > 0
// 	}, [window?.history?.state?.idx])
// 	return (
// 		<>
// 			<AppShell
// 				layout='alt'
// 				header={{ height: { base: 60, md: 70, lg: 80 } }}
// 				footer={{ height: 60 }}
// 				navbar={{
// 					width: { base: 200, md: 300 },
// 					breakpoint: 'sm',
// 					collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
// 				}}
// 			>
// 				<AppShell.Header>
// 					<Group h='100%' px='md' justify='space-between'>
// 						<Group>
// 							<Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
// 							<ActionIcon onClick={toggleDesktop} visibleFrom='sm' variant='default'>
// 								{desktopOpened ? <TbArrowBarLeft /> : <TbArrowBarRight />}
// 							</ActionIcon>
// 							<Divider orientation='vertical' />
// 							<Title order={1} size='h3' fw='400'>
// 								<Template.Slot name='title' />
// 							</Title>
// 						</Group>
// 						<Group>
// 							<ChangeProduct />
// 							<ShopCartBtn />
// 							<PersonalLink />
// 							<InOutLink />
// 							<ThemeBtn />
// 						</Group>
// 					</Group>
// 				</AppShell.Header>
// 				<AppShell.Navbar>
// 					<AppShell.Section p='xs'>
// 						<Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
// 						<Logo />
// 					</AppShell.Section>
// 					<AppShell.Section grow my='xs' component={ScrollArea} px='xs'>
// 						<MainMenu />
// 					</AppShell.Section>
// 					<AppShell.Section p='xs'></AppShell.Section>
// 				</AppShell.Navbar>
// 				<AppShell.Main>
// 					<ScrollArea h={`calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))`}>
// 						<Container size='xl' p='md'>
// 							<Template.Slot name='notification' />
// 							<Outlet />
// 						</Container>
// 					</ScrollArea>
// 				</AppShell.Main>
// 				<AppShell.Footer<Group> component={Group} justify='space-between' gap='xs' px='xs'>
// 					<Template.Slot name='footer'>
// 						<div></div>
// 					</Template.Slot>
// 					<Button color='dark' size='sm' disabled={!back} onClick={() => navigate(-1)}>
// 						Назад
// 					</Button>
// 				</AppShell.Footer>
// 			</AppShell>
// 			<ShopCartDrawer />
// 		</>
// 	)
// }
