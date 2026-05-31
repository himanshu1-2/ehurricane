import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { Field } from '../components/Field';
import Button from '../components/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { colors } from '../theme';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const { loading, error, user } = useSelector((s) => s.userDetails) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};
  const { success } = useSelector((s) => s.userUpdateProfile) || {};
  const {
    loading: loadingOrders,
    error: errorOrders,
    orders = [],
  } = useSelector((s) => s.orderListMy) || {};

  useEffect(() => {
    if (!userInfo) {
      navigation.replace('Login');
      return;
    }
    if (!user || !user.name || success) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(getUserDetails('profile'));
      dispatch(listMyOrders());
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, navigation, userInfo, user, success]);

  const submit = () => {
    if (password !== confirmPassword) setMessage('Passwords do not match');
    else
      dispatch(
        updateUserProfile({ id: user._id, name, email, password })
      );
  };

  return (
    <FormContainer>
      <Text style={styles.h2}>User Profile</Text>
      {message && <Message variant="danger">{message}</Message>}
      {success && <Message variant="success">Profile Updated</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Field label="Name" value={name} onChangeText={setName} />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Field
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button title="Update" onPress={submit} />
        </>
      )}

      <Text style={[styles.h2, { marginTop: 24 }]}>My Orders</Text>
      {loadingOrders ? (
        <Loader />
      ) : errorOrders ? (
        <Message variant="danger">{errorOrders}</Message>
      ) : orders.length === 0 ? (
        <Message>No orders yet</Message>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.id} numberOfLines={1}>
                {item._id}
              </Text>
              <Text>{item.createdAt && item.createdAt.substring(0, 10)}</Text>
              <Text>₹ {Number(item.totalPrice).toFixed(2)}</Text>
              <Text style={{ color: item.isPaid ? colors.success : colors.danger }}>
                {item.isPaid ? 'Paid' : 'Unpaid'}
              </Text>
              <Text style={{ color: item.isDelivered ? colors.success : colors.danger }}>
                {item.isDelivered ? 'Delivered' : 'Pending'}
              </Text>
              <Pressable
                onPress={() => navigation.navigate('Order', { id: item._id })}
              >
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  Details
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  h2: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },
  id: { fontSize: 12, color: colors.textMuted },
});

export default ProfileScreen;
