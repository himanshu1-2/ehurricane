import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme';

const CancelScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Cancelled ✕</Text>
      <Text style={styles.body}>
        Payment cancelled. We'll be in touch shortly!
      </Text>
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', color: colors.danger },
  body: { color: colors.textMuted, marginVertical: 8, textAlign: 'center' },
});

export default CancelScreen;
