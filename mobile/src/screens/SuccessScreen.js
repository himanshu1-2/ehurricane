import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme';

const SuccessScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <View style={styles.tick}>
        <Text style={styles.tickText}>✓</Text>
      </View>
      <Text style={styles.title}>Success</Text>
      <Text style={styles.body}>
        We received your order — thank you! We'll be in touch shortly.
      </Text>
      <Button title="Continue Shopping" onPress={() => navigation.navigate('Home')} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 3,
  },
  tick: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e9f7ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickText: { fontSize: 48, color: colors.success },
  title: { fontSize: 28, fontWeight: '800', marginTop: 12 },
  body: { color: colors.textMuted, marginVertical: 8, textAlign: 'center' },
});

export default SuccessScreen;
