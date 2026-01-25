import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'tailwind-preset-mantine';
import 'tailwindcss';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { themeMantine } from '../../src/app/providers/mantine/theme';

export const parameters = {
    layout: 'fullscreen',
    options: {
        showPanel: false,
        storySort: (a, b) =>
            a.title.localeCompare(b.title, undefined, { numeric: true }),
    },
    backgrounds: { disable: true },
    controls: {},
};

export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Mantine color scheme',
        defaultValue: 'light',
        toolbar: {
            icon: 'mirror',
            items: [
                { value: 'light', title: 'Light' },
                { value: 'dark', title: 'Dark' },
            ],
        },
    },
};

export const decorators = [
    (renderStory: any, context: any) => {
        const scheme = (context.globals.theme || 'light') as 'light' | 'dark';
        return (
            <MantineProvider theme={themeMantine} forceColorScheme={scheme}>
                <DatesProvider settings={{ locale: 'ru' }}>
                    <ColorSchemeScript />
                    <Notifications />
                    <ModalsProvider>{renderStory()}</ModalsProvider>
                </DatesProvider>
            </MantineProvider>
        );
    },
];
