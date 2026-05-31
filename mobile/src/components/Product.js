import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Rating from './Rating';
import { colors } from '../theme';
import { resolveImage } from '../constants';

const Product = ({ product }) => {
  const navigation = useNavigation();
  const open = () => navigation.navigate('Product', { id: product._id });

  return (
    <Pressable onPress={open} style={styles.card}>
      <Image
        source={{ uri: resolveImage(product.image) }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={{ padding: 12 }}>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>
        <Rating
          value={product.rating}
          text={`${product.numReviews} reviews`}
        />
        <Text style={styles.price}>₹ {product.price}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.light,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
    color: colors.text,
  },
  price: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});

export default Product;
