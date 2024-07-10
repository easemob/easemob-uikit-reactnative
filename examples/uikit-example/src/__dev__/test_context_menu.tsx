import React, { useState } from 'react';
import {
  GestureResponderEvent,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ContextMenu = (props: {
  isVisible: boolean;
  onClose: () => void;
  options: {
    label: string;
    onPress: () => void;
  }[];
  position: {
    x: number;
    y: number;
  };
}) => {
  const { isVisible, onClose, options, position } = props;
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View
          style={[
            styles.menuContainer,
            {
              position: 'absolute',
              top: position.y,
              left: position.x,
            },
          ]}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={option.onPress}
            >
              <Text style={styles.menuItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default function YourComponent() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });

  const options = [
    { label: 'Option 1', onPress: () => console.log('Option 1 selected') },
    { label: 'Option 2', onPress: () => console.log('Option 2 selected') },
  ];

  const handleLongPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setTouchPosition({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  return (
    <View style={{ top: 100 }}>
      <TouchableOpacity onLongPress={handleLongPress}>
        <Text>Long press me</Text>
      </TouchableOpacity>
      <ContextMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        options={options}
        position={touchPosition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  menuItem: {
    padding: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
});
