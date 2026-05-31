import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

const Step = ({ label, active, target }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      disabled={!active}
      onPress={() => active && navigation.navigate(target)}
      style={styles.step}
    >
      <Text
        style={[
          styles.label,
          active ? styles.active : styles.disabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const CheckoutSteps = ({ step1, step2, step3, step4 }) => (
  <View style={styles.row}>
    <Step label="Sign In" active={!!step1} target="Login" />
    <Step label="Shipping" active={!!step2} target="Shipping" />
    <Step label="Payment" active={!!step3} target="Payment" />
    <Step label="Place Order" active={!!step4} target="PlaceOrder" />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  step: { paddingHorizontal: 12, paddingVertical: 6 },
  label: { fontWeight: '600' },
  active: { color: colors.primary },
  disabled: { color: colors.textMuted },
});

export default CheckoutSteps;
