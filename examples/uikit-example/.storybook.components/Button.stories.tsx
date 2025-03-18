import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { action } from '@storybook/addon-actions';
import { Button } from '../src/rename.uikit';

const meta = {
  title: 'Basic Button',
  component: Button,
  args: {
    buttonStyle: 'commonButton',
    sizesType: 'middle',
    radiusType: 'medium',
    contentType: 'only-text',
    text: 'Only Text Button',
    onPress: action('onPress'),
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    buttonStyle: 'commonButton',
    sizesType: 'middle',
    radiusType: 'medium',
    contentType: 'only-text',
    text: 'Only Text Button',
  }
};
