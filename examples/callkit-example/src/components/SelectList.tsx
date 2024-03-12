import * as React from 'react';
import { FlatList, type ListRenderItemInfo, Text, View } from 'react-native';
import type { InviteeListProps } from 'react-native-chat-callkit';
import {
  CheckButton,
  Search,
  Text1Button,
  useChatContext,
  useDelayExecTask,
} from 'react-native-chat-uikit';

type DataType = {
  userId: string;
  userName?: string;
  isSelected?: boolean;
  enable?: boolean;
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
          checked={item.isSelected ?? false}
          disable={item.enable === false ? true : undefined}
          onClicked={() => item.onChecked?.(!item.isSelected)}
        />
      </View>
    </View>
  );
};

type SelectListProps = {
  selectedIds: string[];
  maxCount: number;
  onChangeCount?: (count: number) => void;
  onAddedIds?: (ids: string[]) => void;
};
export function SelectList(props: SelectListProps): JSX.Element {
  const { selectedIds, maxCount, onChangeCount, onAddedIds } = props;
  // const { client, currentId } = useAppChatSdkContext();
  const im = useChatContext();
  const data = React.useMemo(() => [] as DataType[], []);
  const [_data, setData] = React.useState(data);
  const [value, setValue] = React.useState('');
  const selectedCount = React.useRef(selectedIds.length);

  const onChangeSelected = React.useCallback(
    (selectedIds: string[]) => {
      const r = [] as string[];
      for (const d of data) {
        if (d.isSelected === true) {
          let existed = false;
          for (const id of selectedIds) {
            if (d.userId === id) {
              existed = true;
              break;
            }
          }
          if (existed === false) {
            r.push(d.userId);
          }
        }
      }
      onAddedIds?.(r);
    },
    [data, onAddedIds]
  );

  const init = React.useCallback(() => {
    im.getAllContacts({
      onResult: (res) => {
        if (res.isOk && res.value && res.value.length > 0) {
          data.length = 0;
          for (const i of res.value) {
            const user = {
              userId: i.userId,
              userName: i.userName,
              onChecked: (checked: boolean) => {
                if (checked === true) {
                  // Note: to add.
                  if (selectedCount.current < maxCount) {
                    ++selectedCount.current;
                    user.isSelected = checked;
                    onChangeCount?.(selectedCount.current);
                    onChangeSelected(selectedIds);
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  // Note: to del.
                  if (selectedCount.current > 0) {
                    --selectedCount.current;
                    user.isSelected = checked;
                    onChangeCount?.(selectedCount.current);
                    onChangeSelected(selectedIds);
                    return true;
                  } else {
                    return false;
                  }
                }
              },
            } as DataType;
            data.push(user);
          }

          // add self
          if (im.userId) {
            data.push({
              userId: im.userId,
              userName: im.userId,
              isSelected: true,
              enable: false,
            } as DataType);
          }

          for (const d of data) {
            for (const id of selectedIds) {
              if (d.userId === id) {
                d.enable = false;
                d.isSelected = true;
              }
            }
          }
          setData([...data]);
        }
      },
    });
    return () => {};
  }, [data, im, maxCount, onChangeCount, onChangeSelected, selectedIds]);

  const execSearch = (keyword: string) => {
    const r = [] as DataType[];
    for (const d of data) {
      if (d.userId.includes(keyword)) {
        r.push(d);
      }
    }
    setData([...r]);
  };

  const { delayExecTask: execSearchTask } = useDelayExecTask(500, execSearch);

  React.useEffect(() => {
    const ret = init();
    return () => {
      ret();
    };
  }, [init]);

  return (
    <View>
      <Search
        value={value}
        onChangeText={(text) => {
          setValue(text);
          execSearchTask(text);
        }}
      />
      <FlatList
        data={_data}
        extraData={_data}
        renderItem={FlatListRenderItem}
      />
    </View>
  );
}

export const SelectListMemo = React.memo(SelectList);

export const ContactList = (props: InviteeListProps): JSX.Element => {
  const { onClose, onCancel, selectedIds, maxCount } = props;
  const [count, setCount] = React.useState<number>(selectedIds.length);
  const addedIdsRef = React.useRef<string[]>([]);
  const content = () => {
    return `(${count}/${maxCount})`;
  };
  return (
    <View
      style={{
        flex: 1,
        top: 44,
        width: '100%',
        // height: 100,
        backgroundColor: 'white',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text1Button
          style={{ height: 40, width: 80 }}
          onPress={() => {
            onClose(addedIdsRef.current);
          }}
          text={'done'}
        />
        <View style={{ width: 10 }} />
        <Text1Button
          style={{ height: 40, width: 80 }}
          onPress={() => {
            onCancel();
          }}
          text={'cancel'}
        />
        <View style={{ width: 10 }} />
        <View>
          <Text>{content()}</Text>
        </View>
      </View>
      <SelectListMemo
        selectedIds={selectedIds}
        maxCount={maxCount}
        onChangeCount={React.useCallback((c: any) => {
          setCount(c);
        }, [])}
        onAddedIds={React.useCallback((ids: string[]) => {
          addedIdsRef.current = ids;
        }, [])}
      />
    </View>
  );
};
