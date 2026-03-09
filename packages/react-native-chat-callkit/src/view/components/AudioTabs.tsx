import { Tab, TabView } from '@rneui/themed';
import * as React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import type { User } from '../../types';
import { DefaultAvatar } from './Avatar';
import { LocalIcon } from './LocalIcon';

const PageCount = 9;

type AudioTabProps = {
  subUsers: User[];
  index: number;
};

export function AudioTab(props: AudioTabProps): React.ReactElement {
  const { subUsers, index } = props;
  const { width: screenWidth } = useWindowDimensions();
  return (
    <TabView.Item
      key={index.toString()}
      style={{
        // backgroundColor: 'red',
        width: '100%',
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          alignContent: 'space-around',
          width: screenWidth,
        }}
      >
        {subUsers.map((user) => {
          return (
            <View
              key={user.userId}
              style={{
                width: '30%',
                height: 120,
                // backgroundColor: 'green',
                margin: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  borderRadius: 85,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    padding: 5,
                    backgroundColor:
                      user.talking === true ? '#14FF72' : undefined,
                  }}
                >
                  <DefaultAvatar
                    userId={user.userId}
                    userAvatar={user.userAvatar}
                    size={80}
                    radius={80}
                  />
                </View>
              </View>
              <View style={{ height: 5 }} />
              <Text
                style={{
                  fontWeight: '600',
                  lineHeight: 18,
                  fontSize: 14,
                  color: 'white',
                }}
              >
                {user.userName ?? user.userId}
              </Text>
              {user.muteAudio === true ? (
                <View
                  style={{
                    position: 'absolute',
                    overflow: 'hidden',
                    borderRadius: 30,
                    backgroundColor: 'grey',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 35,
                    right: 12,
                    width: 30,
                    height: 30,
                  }}
                >
                  <View
                    style={{
                      overflow: 'hidden',
                      backgroundColor: 'white',
                      borderRadius: 24,
                    }}
                  >
                    <LocalIcon name="mic_slash" color="black" size={24} />
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </TabView.Item>
  );
}

// type AudioTabBarProps = {};

// export function AudioTabBar(props: AudioTabBarProps): React.ReactElement {
//   calllog.log('AudioTabBar:', props);
//   return (
//     <Tab.Item
//       active={true}
//       titleStyle={{}}
//       containerStyle={{ width: '10%' }}
//       buttonStyle={{ height: '10%' }}
//       iconPosition="bottom"
//       dense={true}
//       style={{ height: 1, backgroundColor: '#D8D8D8' }}
//     />
//   );
// }

type AudioTabsProps = {
  users: User[];
};

export function AudioTabs(props: AudioTabsProps): React.ReactElement {
  const { users } = props;
  const [index, setIndex] = React.useState(0);
  const initUsers = () => {
    const tu = [] as User[][];
    const pageCount = Math.ceil(users.length / PageCount);
    for (let index = 0; index < pageCount; index++) {
      tu[index] = [];
      for (
        let j = index * PageCount;
        j < PageCount * (index + 1) && j < users.length;
        j++
      ) {
        const user = users[j];
        if (user) {
          tu[index]?.push(user);
        }
      }
    }
    return [pageCount, tu];
  };
  const ret = initUsers();
  const tabUsers = ret[1] as User[][];
  const onIndex = (value: number) => {
    setIndex(value);
  };
  return (
    <>
      <TabView value={index} onChange={onIndex}>
        {tabUsers.map((users, i) => {
          return <AudioTab key={users[0]?.userId} index={i} subUsers={users} />;
        })}
      </TabView>

      {users.length > 1 ? (
        <Tab
          value={index}
          onChange={(e: any) => onIndex(e)}
          indicatorStyle={{
            backgroundColor: 'white',
            height: 3,
          }}
          variant="primary"
        >
          {tabUsers.map((users) => {
            return (
              <Tab.Item
                key={users[0]?.userId}
                style={{ height: 1, backgroundColor: '#D8D8D8' }}
              />
            );
          })}
        </Tab>
      ) : null}
    </>
  );
}
