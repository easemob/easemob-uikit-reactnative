import * as React from 'react';
import { View } from 'react-native';
import {
  BottomTabBar,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  TabPage,
  TabPageBodyItem,
  ThemeContextProvider,
} from 'react-native-chat-uikit';

export function BodyPages(): React.ReactNode[] {
  const list = [1, 2, 3];
  const r = list.map((_, i) => {
    const color = () => {
      if (i === 0) {
        return ['blue', 'red'];
      } else if (i === 1) {
        return ['orange', 'yellow'];
      } else if (i === 2) {
        return ['yellow', 'gray'];
      } else if (i === 3) {
        return ['red', 'yellow'];
      }
      return [];
    };
    return (
      <TabPageBodyItem
        key={i}
        style={{
          backgroundColor: color()[0],
          // height: 100,
        }}
      >
        <View style={{ height: 40, backgroundColor: color()[1], margin: 15 }} />
      </TabPageBodyItem>
    );
  });
  return r;
}

export function BodyPagesT({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) {
  console.log('test:BodyPagesT:', index, currentIndex);
  const color = (i: number) => {
    if (i === 0) {
      return ['blue', 'red'];
    } else if (i === 1) {
      return ['orange', 'yellow'];
    } else if (i === 2) {
      return ['yellow', 'gray'];
    } else if (i === 3) {
      return ['red', 'yellow'];
    }
    return [];
  };
  return (
    <TabPageBodyItem
      key={index}
      style={{
        backgroundColor: color(index)[0],
        // height: 100,
      }}
    >
      <View
        style={{ height: 40, backgroundColor: color(index)[1], margin: 15 }}
      />
    </TabPageBodyItem>
  );
}

export function TestTab() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <View style={{ top: 100 }}>
          <TabPage
            // header={{
            //   // Header: TabPage.DefaultHeader,
            //   HeaderProps: {
            //     titles: ['1', '2', '3', '4'],
            //   },
            // }}
            header={{
              Header: BottomTabBar as any,
              HeaderProps: {
                titles: ['1', '2', '3'],
                items: [
                  {
                    title: '会话',
                    icon: 'bubble_fill',
                  },
                  {
                    title: '联系人',
                    icon: 'person_double_fill',
                  },
                  {
                    title: '我',
                    icon: 'person_single_fill',
                  },
                ],
              } as any,
            }}
            // body={{
            //   type: 'TabPageBody',
            //   // Body: TabPage.DefaultBody,
            //   BodyProps: {
            //     children: BodyPages(),
            //   },
            // }}
            body={{
              type: 'TabPageBodyT',
              BodyProps: {
                RenderChildren: BodyPagesT,
                RenderChildrenProps: {
                  index: 0,
                  currentIndex: 0,
                },
              },
            }}
            height={300}
            // width={300}
            headerPosition="down"
            initIndex={2}
            onCurrentIndex={() => {}}
          />
        </View>
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}

export default function test_tab() {
  return <TestTab />;
}
