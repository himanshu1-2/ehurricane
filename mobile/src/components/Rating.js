import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme';

const Star = ({ filled, half, color }) => (
  <Text style={{ color, fontSize: 16, marginRight: 2 }}>
    {filled ? '★' : half ? '⯨' : '☆'}
  </Text>
);

const Rating = ({ value = 0, text, color = colors.star }) => {
  const stars = [1, 2, 3, 4, 5].map((n) => {
    const filled = value >= n;
    const half = !filled && value >= n - 0.5;
    return <Star key={n} filled={filled} half={half} color={color} />;
  });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {stars}
      {text ? (
        <Text style={{ marginLeft: 6, color: colors.textMuted, fontSize: 12 }}>
          {text}
        </Text>
      ) : null}
    </View>
  );
};

export default Rating;
