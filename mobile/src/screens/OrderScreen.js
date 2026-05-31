import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Button from '../components/Button';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions';
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants';
import { resolveImage } from '../constants';
import { colors } from '../theme';

const OrderScreen = ({ route, navigation }) => {
  const orderId = route.params?.id;
  const dispatch = useDispatch();

  const { order, loading, error } =
    useSelector((s) => s.orderDetails) || {};
  const { loading: loadingPay, success: successPay } =
    useSelector((s) => s.orderPay) || {};
  const { success: successDeliver } =
    useSelector((s) => s.orderDeliver) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};

  useEffect(() => {
    if (!userInfo) {
      navigation.replace('Login');
      return;
    }
    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, successPay, successDeliver, order, navigation, userInfo]);

  if (loading || !order) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {typeof error === 'string' ? error : 'Error loading order'}
      </Message>
    );

  const addDecimals = (n) => (Math.round(n * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(
    (order.orderItems || []).reduce((acc, i) => acc + i.price * i.qty, 0)
  );

  const makePayment = () => navigation.replace('Success');

  const markPaidAdmin = () => {
    const paymentResult = {
      id: `manual-${Date.now()}`,
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      payer: { email_address: order.user?.email || '' },
    };
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => dispatch(deliverOrder(order));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
        Order {order._id}
      </Text>

      <Section title="Shipping">
        <Text>
          <Text style={{ fontWeight: '700' }}>Name: </Text>
          {order.user?.name}
        </Text>
        <Pressable onPress={() => Linking.openURL(`mailto:${order.user?.email}`)}>
          <Text style={{ color: colors.primary }}>
            {order.user?.email}
          </Text>
        </Pressable>
        <Text>
          <Text style={{ fontWeight: '700' }}>Address: </Text>
          {order.shippingAddress?.address}, {order.shippingAddress?.city}{' '}
          {order.shippingAddress?.postalCode}, mobile:{' '}
          {order.shippingAddress?.mobile}
        </Text>
        {order.isDelivered ? (
          <Message variant="success">Delivered on {order.deliveredAt}</Message>
        ) : (
          <Message variant="danger">Not Delivered</Message>
        )}
      </Section>

      <Section title="Payment Method">
        <Text>Method: {order.paymentMethod}</Text>
        {order.isPaid ? (
          <Message variant="success">Paid on {order.paidAt}</Message>
        ) : (
          <Message variant="danger">Not Paid</Message>
        )}
      </Section>

      <Section title="Order Items">
        {(order.orderItems || []).length === 0 ? (
          <Message>Order is empty</Message>
        ) : (
          order.orderItems.map((item, idx) => (
            <View key={idx} style={styles.row}>
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
                <Text style={{ color: colors.primary }}>{item.name}</Text>
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
        <Row label="Shipping" value={`₹ ${order.shippingPrice}`} />
        <Row label="Tax" value={`₹ ${order.taxPrice}`} />
        <Row label="Total" value={`₹ ${order.totalPrice}`} bold />
        {!order.isPaid && (
          <Button title="Checkout" onPress={makePayment} />
        )}
        {userInfo?.isAdmin && !order.isPaid && (
          <Button
            variant="success"
            small
            title="Mark As Paid"
            disabled={loadingPay}
            onPress={markPaidAdmin}
          />
        )}
        {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
          <Button title="Mark As Delivered" onPress={deliverHandler} />
        )}
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

export default OrderScreen;
