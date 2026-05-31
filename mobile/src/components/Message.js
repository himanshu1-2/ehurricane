import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const palette = {
  info: { bg: '#cfe2ff', fg: '#084298', border: '#b6d4fe' },
  danger: { bg: '#f8d7da', fg: '#842029', border: '#f5c2c7' },
  success: { bg: '#d1e7dd', fg: '#0f5132', border: '#badbcc' },
  warning: { bg: '#fff3cd', fg: '#664d03', border: '#ffecb5' },
};

const Message = ({ variant = 'info', children }) => {
  const p = palette[variant] || palette.info;
  return (
    <View
      style={[
        styles.box,
        { backgroundColor: p.bg, borderColor: p.border },
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={{ color: p.fg }}>{children}</Text>
      ) : (
        <Text style={{ color: p.fg }}>{children}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
  },
});

export default Message;
