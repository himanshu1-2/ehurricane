import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigation = useNavigation();

  const submit = () => {
    if (keyword.trim()) {
      navigation.navigate('Home', { keyword: keyword.trim() });
    } else {
      navigation.navigate('Home', { keyword: undefined });
    }
  };

  return (
    <View style={styles.row}>
      <TextInput
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Search products..."
        placeholderTextColor={colors.textMuted}
        onSubmitEditing={submit}
        returnKeyType="search"
        style={styles.input}
      />
      <Pressable onPress={submit} style={styles.btn}>
        <Text style={styles.btnText}>Search</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    color: colors.text,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  btnText: { color: '#fff', fontWeight: '700' },
});

export default SearchBox;
