import React, { useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Button from '../components/Button';
import { listCoupons, deleteCoupon } from '../actions/couponActions';
import { COUPON_CREATE_RESET } from '../constants/couponConstants';
import { colors } from '../theme';

const CouponListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error, coupons = [] } =
    useSelector((s) => s.couponList) || {};
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((s) => s.couponDelete) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};

  useEffect(() => {
    dispatch({ type: COUPON_CREATE_RESET });
    if (!userInfo || !userInfo.isAdmin) {
      navigation.replace('Login');
      return;
    }
    dispatch(listCoupons());
  }, [dispatch, navigation, userInfo, successDelete]);

  const onDelete = (id) =>
    Alert.alert('Confirm', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteCoupon(id)),
      },
    ]);

  const formatDiscount = (c) =>
    c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`;

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      ListHeaderComponent={
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '800' }}>Coupons</Text>
            <Button
              small
              title="+ Create"
              onPress={() => navigation.navigate('CouponEdit', { id: null })}
            />
          </View>
          {loadingDelete && <Loader />}
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}
        </View>
      }
      data={coupons}
      keyExtractor={(c) => c._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={{ fontWeight: '800', fontSize: 16 }}>{item.code}</Text>
          <Text>Discount: {formatDiscount(item)}</Text>
          <Text>Min cart: ₹{item.minCartValue || 0}</Text>
          <Text>First-time only: {item.firstTimeOnly ? 'Yes' : 'No'}</Text>
          <Text>
            Used: {item.usedCount || 0} / {item.usageLimit ? item.usageLimit : '∞'}
          </Text>
          <Text>
            Expires:{' '}
            {item.expiresAt
              ? new Date(item.expiresAt).toLocaleDateString()
              : '—'}
          </Text>
          <Text style={{ color: item.isActive ? colors.success : colors.danger }}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Button
              small
              variant="light"
              title="Edit"
              onPress={() => navigation.navigate('CouponEdit', { id: item._id })}
            />
            <View style={{ width: 8 }} />
            <Button
              small
              variant="danger"
              title="Delete"
              onPress={() => onDelete(item._id)}
            />
          </View>
        </View>
      )}
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
});

export default CouponListScreen;
