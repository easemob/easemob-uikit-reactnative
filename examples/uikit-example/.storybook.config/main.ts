import type { StorybookConfig } from "@storybook/react-native";
// import { StorybookConfig } from '@storybook/react-native-web-vite';

const main: StorybookConfig = {
  stories: [
    '../.storybook.components/**/*.stories.mdx',
    '../.storybook.components/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
  ],

  // framework: {
  //   name: '@storybook/react-native-web-vite',
  //   options: {},
  // },

  docs: {
    autodocs: true,
  },

  typescript: {
    reactDocgen: 'react-docgen',
  },
};

export default main;
