import React from 'react';
import { ScrollView, Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme';

const Paginate = ({ pages, page, onChange }) => {
  if (!pages || pages <= 1) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8 }}
    >
      <View style={{ flexDirection: 'row' }}>
        {[...Array(pages).keys()].map((x) => {
          const n = x + 1;
          const active = n === page;
          return (
            <Pressable
              key={n}
              onPress={() => onChange && onChange(n)}
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text style={[styles.text, active && styles.textActive]}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pill: {
    minWidth: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: { color: colors.primary, fontSize: 14 },
  textActive: { color: '#fff', fontWeight: '700' },
});

export default Paginate;
