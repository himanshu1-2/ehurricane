import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Button from '../components/Button';
import { Select } from '../components/Field';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { resolveImage } from '../constants';
import { colors } from '../theme';

const CartScreen = ({ route, navigation }) => {
  const productId = route.params?.id;
  const qty = route.params?.qty ? Number(route.params.qty) : 1;
  const dispatch = useDispatch();

  const { cartItems = [] } = useSelector((s) => s.cart) || {};

  useEffect(() => {
    if (productId) dispatch(addToCart(productId, qty));
  }, [dispatch, productId, qty]);

  const remove = (id) => dispatch(removeFromCart(id));

  const checkout = () => {
    navigation.navigate('Login', { redirect: 'Shipping' });
  };

  const subtotalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={
        <Text style={styles.heading}>Shopping Cart</Text>
      }
      data={cartItems}
      keyExtractor={(item) => item.product}
      ListEmptyComponent={
        <Message>
          Your cart is empty.{' '}
          <Text
            onPress={() => navigation.navigate('Home')}
            style={{ color: colors.primary }}
          >
            Go back
          </Text>
        </Message>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Image
            source={{ uri: resolveImage(item.image) }}
            style={styles.thumb}
          />
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Pressable
              onPress={() =>
                navigation.navigate('Product', { id: item.product })
              }
            >
              <Text style={styles.title} numberOfLines={2}>
                {item.name}
              </Text>
            </Pressable>
            <Text>₹ {item.price}</Text>
            <View style={{ width: 120 }}>
              <Select
                value={item.qty}
                onChange={(v) =>
                  dispatch(addToCart(item.product, Number(v)))
                }
                items={[...Array(item.countInStock).keys()].map((x) => ({
                  label: String(x + 1),
                  value: x + 1,
                }))}
              />
            </View>
            <Button
              small
              variant="light"
              title="Remove"
              onPress={() => remove(item.product)}
            />
          </View>
        </View>
      )}
      ListFooterComponent={
        cartItems.length > 0 && (
          <View style={styles.summary}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              Subtotal ({subtotalCount} items)
            </Text>
            <Text style={{ fontSize: 22, fontWeight: '800', marginVertical: 6 }}>
              ₹ {subtotalPrice}
            </Text>
            <Button title="Proceed To Checkout" onPress={checkout} />
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumb: { width: 72, height: 72, borderRadius: 8, backgroundColor: colors.light },
  title: { fontWeight: '600' },
  summary: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.bg,
  },
});

export default CartScreen;
