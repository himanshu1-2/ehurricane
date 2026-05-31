import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Button from '../components/Button';
import { createOrder } from '../actions/orderActions';
import { getApplicableCoupon } from '../actions/couponActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { USER_DETAILS_RESET } from '../constants/userConstants';
import { resolveImage } from '../constants';
import { colors } from '../theme';

const PlaceOrderScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart) || {};
  const { applicable } = useSelector((s) => s.couponApplicable) || {};
  const { order, success, error } = useSelector((s) => s.orderCreate) || {};

  const appliedCoupon = applicable?.code || null;
  const discount = Number(applicable?.discount) || 0;

  useEffect(() => {
    if (!cart.shippingAddress?.address) navigation.replace('Shipping');
    else if (!cart.paymentMethod) navigation.replace('Payment');
  }, [cart.shippingAddress, cart.paymentMethod, navigation]);

  useEffect(() => {
    dispatch(getApplicableCoupon());
  }, [dispatch]);

  const addDecimals = (n) => (Math.round(n * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(
    (cart.cartItems || []).reduce((acc, i) => acc + i.price * i.qty, 0)
  );
  const shippingPrice = 0;
  const taxPrice = 0;
  const totalPrice = Math.max(
    0,
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice) - discount
  ).toFixed(2);

  useEffect(() => {
    if (success && order?._id) {
      navigation.replace('Order', { id: order._id });
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, order, navigation, dispatch]);

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        couponCode: appliedCoupon,
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <CheckoutSteps step1 step2 step3 step4 />

      <Section title="Shipping">
        <Text>
          {cart.shippingAddress?.address}, {cart.shippingAddress?.city}{' '}
          {cart.shippingAddress?.postalCode}
        </Text>
      </Section>

      <Section title="Payment Method">
        <Text>Method: {cart.paymentMethod}</Text>
      </Section>

      <Section title="Order Items">
        {(cart.cartItems || []).length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          cart.cartItems.map((item) => (
            <View key={item.product} style={styles.row}>
              <Image
                source={{ uri: resolveImage(item.image) }}
                style={styles.thumb}
              />
              <Pressable
                onPress={() =>
                  navigation.navigate('Product', { id: item.product })
                }
                style={{ flex: 1, paddingHorizontal: 8 }}
              >
                <Text numberOfLines={2} style={{ color: colors.primary }}>
                  {item.name}
                </Text>
              </Pressable>
              <Text>
                {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
              </Text>
            </View>
          ))
        )}
      </Section>

      <Section title="Order Summary">
        <Row label="Items" value={`₹ ${itemsPrice}`} />
        <Row label="Shipping" value={`₹ ${shippingPrice}`} />
        <Row label="Tax" value={`₹ ${taxPrice}`} />
        {discount > 0 && (
          <Row
            label={`Discount${appliedCoupon ? ` (${appliedCoupon})` : ''}`}
            value={`- ₹ ${discount.toFixed(2)}`}
          />
        )}
        <Row label="Total" value={`₹ ${totalPrice}`} bold />
        {error && <Message variant="danger">{error}</Message>}
        <Button
          title="Place Order"
          onPress={placeOrder}
          disabled={(cart.cartItems || []).length === 0}
        />
      </Section>
    </ScrollView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Row = ({ label, value, bold }) => (
  <View style={styles.kv}>
    <Text style={bold && { fontWeight: '700' }}>{label}</Text>
    <Text style={bold && { fontWeight: '700' }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  section: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumb: { width: 48, height: 48, borderRadius: 4 },
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});

export default PlaceOrderScreen;
