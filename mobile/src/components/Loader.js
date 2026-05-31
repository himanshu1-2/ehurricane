import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../theme';

const Loader = ({ size = 'large' }) => (
  <View style={{ padding: 24, alignItems: 'center' }}>
    <ActivityIndicator size={size} color={colors.primary} />
  </View>
);

export default Loader;
