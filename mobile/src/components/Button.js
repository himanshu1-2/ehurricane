import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme';

const variants = {
  primary: { bg: colors.primary, fg: '#fff' },
  danger: { bg: colors.danger, fg: '#fff' },
  success: { bg: colors.success, fg: '#fff' },
  light: { bg: colors.light, fg: colors.text, border: colors.border },
  outline: { bg: 'transparent', fg: colors.primary, border: colors.primary },
};

const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  small,
  style,
}) => {
  const v = variants[variant] || variants.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: v.bg,
          borderColor: v.border || v.bg,
          borderWidth: v.border ? 1 : 0,
          opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
          paddingVertical: small ? 6 : 10,
          paddingHorizontal: small ? 10 : 16,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <Text style={[styles.text, { color: v.fg, fontSize: small ? 13 : 15 }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  text: { fontWeight: '600' },
});

export default Button;
