import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Alert,
  DeviceEventEmitter,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {
  CallError,
  CallListener,
  CallType,
  CallUser,
  formatElapsed,
  MultiCall,
  SingleCall,
  useCallkitSdkContext,
} from 'react-native-chat-callkit';
import {
  CheckButton,
  Text1Button,
  useChatContext,
} from 'react-native-chat-uikit';
import { FlatList } from 'react-native-gesture-handler';

import { ContactList } from '../components/SelectList';
import type { RootParamsList } from '../routes';

let gid: string = '';
let gps: string = '';
let gt = 'agora' as 'agora' | 'easemob';
let agoraAppId = '';

try {
  const env = require('../env');
  gid = env.id ?? '';
  gps = env.ps ?? '';
  gt = env.accountType ?? 'agora';
  agoraAppId = env.agoraAppId;
} catch (e) {
  console.warn('test:', e);
}

type DataType = {
  userId: string;
  userName?: string;
  isSelected?: boolean;
  onChecked?: ((checked: boolean) => boolean) | undefined;
};
const FlatListRenderItem = (
  info: ListRenderItemInfo<DataType>
): React.ReactElement | null => {
  const { item } = info;
  return (
    <View
      style={{
        height: 40,
        backgroundColor: '#f5f5f5',
        marginHorizontal: 20,
        justifyContent: 'center',
        marginVertical: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{item.userId}</Text>
        <CheckButton
          onClicked={() => item.onChecked?.(!item.isSelected)}
          checked={item.isSelected ?? false}
        />
      </View>
    </View>
  );
};
type ContactListRef = {
  // showCall: (params: {
  //   callType: CallType;
  //   currentId: string;
  //   inviterId: string;
  // }) => void;
  // hideCall: () => void;
  getData: () => DataType[];
};
type ContactListProps = {
  propsRef?: React.RefObject<ContactListRef>;
};
const ContactListMemo = React.memo((props: ContactListProps) => {
  console.log('test:ContactList:', props);
  const { propsRef } = props;
  const im = useChatContext();
  const data = React.useMemo(() => [] as DataType[], []);
  const [_data, setData] = React.useState(data);

  if (propsRef?.current) {
    propsRef.current.getData = () => {
      return data;
    };
  }

  const init = React.useCallback(() => {
    console.log('test:ContactList:init:');
    im.getAllContacts({
      onResult: (res) => {
        if (res.isOk && res.value) {
          console.log('test:ContactList:init:result:', res);
          data.length = 0;
          for (const i of res.value) {
            const user = {
              userId: i.userId,
              userName: i.userName,
              onChecked: (checked: boolean) => {
                user.isSelected = checked;
                setData([...data]);
                return true;
              },
            } as DataType;
            data.push(user);
          }
          setData([...data]);
        }
      },
    });
  }, [data, im]);
  React.useEffect(() => {
    init();
    // initApi();
  }, [init]);
  return (
    <>
      <FlatList
        data={_data}
        extraData={_data}
        renderItem={FlatListRenderItem}
      />
      {/* <_Call
        callType={callType}
        currentId={currentId}
        inviterId={inviterId}
        visible={visible}
        onRequestClose={onRequestClose}
      /> */}
    </>
  );
});

type LogType = {
  index: number;
  content: string;
  level?: number;
};
const LogListRenderItem = (
  info: ListRenderItemInfo<LogType>
): React.ReactElement | null => {
  const { item } = info;
  return (
    <View
      style={{
        // height: 40,
        backgroundColor: '#f5f5f5',
        // marginHorizontal: 10,
        // justifyContent: 'center',
        marginVertical: 1,
      }}
    >
      <Text
        style={{
          flexWrap: 'wrap',
          marginHorizontal: 10,
        }}
      >
        {item.content}
      </Text>
    </View>
  );
};
type LogListRef = {
  start: () => void;
  stop: () => void;
  clear: () => void;
};
type LogListProps = {
  propsRef?: React.RefObject<LogListRef>;
};
function LogList(props: LogListProps): JSX.Element {
  console.log('test:LogList:p', props);
  const { propsRef } = props;
  const { call } = useCallkitSdkContext();
  const index = React.useRef(0);
  const [_data, setData] = React.useState([] as LogType[]);
  const init = React.useCallback(
    (enableLog: boolean) => {
      console.log('test:LogList:init');
      if (enableLog) {
        const log = async (message?: any, ...optionalParams: any[]) => {
          const arr = [message, ...optionalParams];
          let str = '';
          for (const a of arr) {
            if (a?.toString) {
              str += a.toString();
            }
          }
          _data.push({ index: index.current, content: str });
          index.current += 1;
          // queueMicrotask(() => {
          //   setData([..._data]);
          // });
          // DeviceEventEmitter.emit('log', '');
        };
        call.setLogHandler(log);
      } else {
        call.setLogHandler(undefined);
      }
    },
    [_data, call]
  );
  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('log', () => {
      console.log('test:234:');
      setData([..._data]);
    });
    init(true);
    return () => {
      sub.remove();
    };
  }, [_data, init]);

  if (propsRef) {
    if (propsRef.current) {
      propsRef.current.clear = () => {
        setData([]);
      };
      propsRef.current.stop = () => {
        init(false);
      };
      propsRef.current.stop = () => {
        init(true);
      };
    }
  }

  return (
    <FlatList data={_data} extraData={_data} renderItem={LogListRenderItem} />
  );
}

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootParamsList, 'Home'>): JSX.Element {
  console.log('test:HomeScreen:');
  const contactListRef = React.useRef<ContactListRef>({} as any);
  const { call } = useCallkitSdkContext();
  const [enableLog, setEnableLog] = React.useState(false);
  const im = useChatContext();

  const { showMultiCall, showSingleCall } = useCallApi();
  const [visible, setVisible] = React.useState(false);
  const [inviterId, setInviterId] = React.useState('');
  const [currentId, setCurrentId] = React.useState('');
  const [callType, setCallType] = React.useState<CallType>(CallType.Audio1v1);

  const onRequestClose = React.useCallback(() => {
    setVisible(false);
  }, []);

  const _Call = (props: {
    callType: CallType;
    currentId: string;
    inviterId: string;
    visible: boolean;
    onRequestClose: () => void;
  }) => {
    console.log('test:_Call:', props);
    const { callType, currentId, inviterId, visible, onRequestClose } = props;
    const inviteeIds = [] as string[];
    const invitees = [] as CallUser[];
    const _data = contactListRef.current.getData();
    for (const i of _data) {
      if (i.isSelected === true) {
        inviteeIds.push(i.userId);
        invitees.push({
          userId: i.userId,
          userName: `${i.userId}_name`,
          userAvatarUrl:
            'https://cdn0.iconfinder.com/data/icons/creatype-pet-shop-glyph/64/1_paw_dog_cat_paws_pets_animal-14-128.png',
        } as CallUser);
      }
    }
    if (visible !== true) {
      return null;
    }
    if (currentId === inviterId && inviteeIds.length === 0) {
      Alert.alert(`error: please add invitee.`);
      return null;
    }
    if (callType === CallType.Audio1v1 || callType === CallType.Video1v1) {
      return showSingleCall({
        appKey: im.client.options?.appKey ?? '',
        agoraAppId: agoraAppId,
        inviterId: inviterId,
        currentId: currentId,
        inviteeIds: inviterId === currentId ? inviteeIds : [currentId],
        callType: callType,
        onRequestClose: onRequestClose,
      });
    } else if (
      callType === CallType.AudioMulti ||
      callType === CallType.VideoMulti
    ) {
      return showMultiCall({
        appKey: im.client.options?.appKey ?? '',
        agoraAppId: agoraAppId,
        inviterId: inviterId,
        currentId: currentId,
        inviteeIds: inviterId === currentId ? inviteeIds : [currentId],
        callType: callType,
        // invitees: invitees,
        onRequestClose: onRequestClose,
      });
    } else {
      return null;
    }
  };

  const showCall = React.useCallback(
    (params: { callType: CallType; currentId: string; inviterId: string }) => {
      console.log('test:showCall:', params);
      const { callType, currentId, inviterId } = params;
      setInviterId(inviterId);
      setCurrentId(currentId);
      setCallType(callType);
      setVisible(true);
    },
    []
  );
  // const hideCall = () => {
  //   setVisible(false);
  // };

  const addListener = React.useCallback(() => {
    const listener = {
      onCallReceived: (params: {
        channelId: string;
        inviterId: string;
        callType: CallType;
        extension?: any;
      }) => {
        console.log('onCallReceived:', params);
        showCall({
          callType: params.callType,
          currentId: im.userId ?? '',
          inviterId: params.inviterId,
        });
      },
      onCallOccurError: (params: { channelId: string; error: CallError }) => {
        console.warn('onCallOccurError:', params);
      },
    } as CallListener;
    call.addListener(listener);
    return () => {
      call.removeListener(listener);
    };
  }, [call, im.userId, showCall]);

  React.useEffect(() => {
    const sub = addListener();
    return () => {
      sub();
    };
  }, [addListener]);

  const info = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginHorizontal: 20 }}>
          <Text>{im.userId}</Text>
        </View>
        <Text1Button
          style={{ height: 40, width: 100 }}
          onPress={() => {
            im.logout({
              result: (res) => {
                if (res.isOk) {
                  navigation.navigate('Login', {
                    params: { id: gid, pass: gps, accountType: gt },
                  });
                } else {
                  console.warn('test:error:', res.error);
                }
              },
            });
          }}
          text={'logout'}
        />
      </View>
    );
  };

  const tools = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginVertical: 20,
          flexWrap: 'wrap',
        }}
      >
        <Text1Button
          style={style.button}
          onPress={() => {
            showCall({
              callType: CallType.Video1v1,
              currentId: im.userId ?? '',
              inviterId: im.userId ?? '',
            });
          }}
          text={'singleV'}
        />
        <Text1Button
          style={style.button}
          onPress={() => {
            showCall({
              callType: CallType.Audio1v1,
              currentId: im.userId ?? '',
              inviterId: im.userId ?? '',
            });
          }}
          text={'singleA'}
        />
        <Text1Button
          style={style.button}
          onPress={() => {
            showCall({
              callType: CallType.VideoMulti,
              currentId: im.userId ?? '',
              inviterId: im.userId ?? '',
            });
          }}
          text={'multiV'}
        />
        <Text1Button
          style={style.button}
          onPress={() => {
            showCall({
              callType: CallType.AudioMulti,
              currentId: im.userId ?? '',
              inviterId: im.userId ?? '',
            });
          }}
          text={'multiA'}
        />
        <Text1Button
          style={style.button}
          onPress={() => {
            navigation.push('Test', { params: {} });
          }}
          text={'navi'}
        />
        <Text1Button
          style={style.button}
          onPress={() => {
            setEnableLog(!enableLog);
          }}
          text={'log'}
        />
      </View>
    );
  };
  const list = () => {
    return (
      <View
        style={{
          flex: 1,
          borderColor: 'grey',
          borderWidth: 1,
          // backgroundColor: 'red',
        }}
      >
        <ContactListMemo propsRef={contactListRef} />
      </View>
    );
  };
  const log = () => {
    return enableLog ? (
      <View
        style={{
          flexGrow: 5,
          backgroundColor: 'red',
          height: 400,
        }}
      >
        <LogList />
      </View>
    ) : null;
  };
  return (
    <>
      <View style={{ top: 44, flex: 1 }}>
        {info()}
        {tools()}
        {list()}
        {log()}
      </View>
      <_Call
        callType={callType}
        currentId={currentId}
        inviterId={inviterId}
        visible={visible}
        onRequestClose={onRequestClose}
      />
    </>
  );
}

const style = StyleSheet.create({
  button: {
    height: 40,
    width: 100,
    marginHorizontal: 10,
    marginBottom: 10,
  },
});

function useCallApi() {
  const showSingleCall = React.useCallback(
    (params: {
      appKey: string;
      agoraAppId: string;
      inviterId: string;
      currentId: string;
      inviteeIds: string[];
      callType: CallType;
      inviterName?: string;
      inviterAvatar?: string;
      invitees?: CallUser[];
      onRequestClose: () => void;
    }) => {
      const {
        inviteeIds,
        currentId,
        inviterId,
        callType,
        invitees,
        inviterAvatar,
        inviterName,
        onRequestClose,
      } = params;
      return (
        <SingleCall
          inviterId={inviterId}
          inviterName={inviterName}
          inviterAvatar={inviterAvatar}
          currentId={currentId}
          inviteeId={inviteeIds[0] ?? ''}
          inviteeName={invitees?.[0]?.userName}
          inviteeAvatar={invitees?.[0]?.userAvatarUrl}
          callType={callType === CallType.Audio1v1 ? 'audio' : 'video'}
          onClose={(elapsed, reason) => {
            console.log('test:stateEvent.onClose', elapsed, reason);
            onRequestClose();
            if (Platform.OS === 'android') {
              if (reason) {
                ToastAndroid.show(
                  `tip: reason: ${JSON.stringify(reason)}`,
                  ToastAndroid.SHORT
                );
              } else {
                ToastAndroid.show(
                  `tip: Call End: ${formatElapsed(elapsed)}`,
                  ToastAndroid.SHORT
                );
              }
            } else {
              if (reason) {
                Alert.alert(`tip: reason: ${JSON.stringify(reason)}`);
              } else {
                Alert.alert(`tip: Call End: ${formatElapsed(elapsed)}`);
              }
            }
          }}
          onHangUp={() => {
            console.log('test:stateEvent.onHangUp');
            onRequestClose();
          }}
          onCancel={() => {
            console.log('test:stateEvent.onCancel');
            onRequestClose();
          }}
          onRefuse={() => {
            console.log('test:stateEvent.onRefuse');
            onRequestClose();
          }}
          onError={(error) => {
            console.log('test:stateEvent.onError', error);
            onRequestClose();
            if (Platform.OS === 'android') {
              ToastAndroid.show(`error: ${JSON.stringify(error)}`, 3);
            } else {
              Alert.alert(`error: ${JSON.stringify(error)}`);
            }
          }}
        />
      );
    },
    []
  );
  const showMultiCall = React.useCallback(
    (params: {
      appKey: string;
      agoraAppId: string;
      inviterId: string;
      currentId: string;
      inviteeIds: string[];
      callType: CallType;
      inviterName?: string;
      inviterAvatar?: string;
      invitees?: CallUser[];
      onRequestClose: () => void;
    }) => {
      const {
        inviteeIds,
        inviterId,
        invitees,
        inviterAvatar,
        inviterName,
        currentId,
        callType,
        onRequestClose,
      } = params;
      return (
        <MultiCall
          inviterId={inviterId}
          inviterName={inviterName}
          inviterAvatar={inviterAvatar}
          currentId={currentId}
          callType={callType === CallType.AudioMulti ? 'audio' : 'video'}
          inviteeIds={inviteeIds}
          inviteeList={{ InviteeList: ContactList }}
          invitees={invitees}
          onClose={(elapsed, reason) => {
            console.log('test:stateEvent.onClose', elapsed, reason);
            onRequestClose();
            if (Platform.OS === 'android') {
              if (reason) {
                ToastAndroid.show(
                  `tip: reason: ${JSON.stringify(reason)}`,
                  ToastAndroid.SHORT
                );
              } else {
                ToastAndroid.show(
                  `tip: Call End: ${formatElapsed(elapsed)}`,
                  ToastAndroid.SHORT
                );
              }
            } else {
              if (reason) {
                Alert.alert(`tip: reason: ${JSON.stringify(reason)}`);
              } else {
                Alert.alert(`tip: Call End: ${formatElapsed(elapsed)}`);
              }
            }
          }}
          onHangUp={() => {
            console.log('test:stateEvent.onHangUp');
            onRequestClose();
          }}
          onCancel={() => {
            console.log('test:stateEvent.onCancel');
            onRequestClose();
          }}
          onRefuse={() => {
            console.log('test:stateEvent.onRefuse');
            onRequestClose();
          }}
          onError={(error) => {
            console.log('test:stateEvent.onError', error);
            onRequestClose();
            if (Platform.OS === 'android') {
              ToastAndroid.show(`error: ${JSON.stringify(error)}`, 3);
            } else {
              Alert.alert(`error: ${JSON.stringify(error)}`);
            }
          }}
        />
      );
    },
    []
  );

  return {
    showSingleCall,
    showMultiCall,
  };
}
