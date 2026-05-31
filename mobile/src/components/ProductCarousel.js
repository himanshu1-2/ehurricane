import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';
import { resolveImage } from '../constants';
import { colors } from '../theme';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = Math.min(width - 16, 480);

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, error, products = [] } = productTopRated || {};

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!products.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % Math.min(products.length, 8);
        listRef.current &&
          listRef.current.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [products.length]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!products.length) return null;

  const items = products.slice(0, 8);

  return (
    <FlatList
      ref={listRef}
      data={items}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      getItemLayout={(_, i) => ({
        length: SLIDE_WIDTH,
        offset: SLIDE_WIDTH * i,
        index: i,
      })}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('Product', { id: item._id })}
          style={[styles.slide, { width: SLIDE_WIDTH }]}
        >
          <Image
            source={{ uri: resolveImage(item.image) }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.price}>₹ {Number(item.price).toFixed(0)}</Text>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    height: 220,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.light,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  price: { color: '#fff', fontSize: 14, marginTop: 2 },
});

export default ProductCarousel;
