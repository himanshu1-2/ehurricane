import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Button from '../components/Button';
import { listOrders } from '../actions/orderActions';
import { colors } from '../theme';

const OrderListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, orders, page, pages } =
    useSelector((s) => s.orderList) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};

  const items = Array.isArray(orders) ? orders : [];

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders(pageNumber));
    } else {
      navigation.replace('Login');
    }
  }, [dispatch, navigation, userInfo, pageNumber]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      ListHeaderComponent={
        <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
          Orders
        </Text>
      }
      data={items}
      keyExtractor={(o) => o._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.id} numberOfLines={1}>
            {item._id}
          </Text>
          <Text>{item.user?.name}</Text>
          <Text style={{ color: colors.textMuted }}>
            {item.createdAt && item.createdAt.substring(0, 10)}
          </Text>
          <Text style={{ fontWeight: '700' }}>
            ₹ {Number(item.totalPrice).toFixed(2)}
          </Text>
          <Text style={{ color: item.isPaid ? colors.success : colors.danger }}>
            {item.isPaid ? 'Paid' : 'Unpaid'}
          </Text>
          <Text
            style={{
              color: item.isDelivered ? colors.success : colors.danger,
            }}
          >
            {item.isDelivered ? 'Delivered' : 'Pending'}
          </Text>
          <Button
            small
            variant="light"
            title="Details"
            onPress={() => navigation.navigate('Order', { id: item._id })}
          />
        </View>
      )}
      ListFooterComponent={
        <Paginate pages={pages} page={page} onChange={setPageNumber} />
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  id: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
});

export default OrderListScreen;
