import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../theme';

export const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  autoCapitalize = 'none',
}) => (
  <View style={styles.group}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      style={[styles.input, multiline && { height: 80 }]}
      value={value !== undefined && value !== null ? String(value) : ''}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      autoCapitalize={autoCapitalize}
    />
  </View>
);

export const Select = ({ label, value, onChange, items }) => (
  <View style={styles.group}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={styles.pickerWrap}>
      <Picker selectedValue={value} onValueChange={onChange}>
        {items.map((it) => (
          <Picker.Item key={String(it.value)} label={it.label} value={it.value} />
        ))}
      </Picker>
    </View>
  </View>
);

export const Check = ({ label, value, onChange }) => (
  <View style={[styles.group, { flexDirection: 'row', alignItems: 'center' }]}>
    <Switch value={!!value} onValueChange={onChange} />
    <Text style={{ marginLeft: 8 }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  group: { marginBottom: 12 },
  label: { marginBottom: 4, fontWeight: '600', color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.bg,
    color: colors.text,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.bg,
  },
});
