import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Button from '../components/Button';
import { listUsers, deleteUser } from '../actions/userActions';
import { colors } from '../theme';

const UserListScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { loading, error, users = [] } =
    useSelector((s) => s.userList) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};
  const { success: successDelete } =
    useSelector((s) => s.userDelete) || {};

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) dispatch(listUsers());
    else navigation.replace('Login');
  }, [dispatch, navigation, userInfo, successDelete]);

  const onDelete = (id) =>
    Alert.alert('Confirm', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteUser(id)) },
    ]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      ListHeaderComponent={
        <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
          Users
        </Text>
      }
      data={users}
      keyExtractor={(u) => u._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.id}>{item._id}</Text>
          <Text style={{ fontWeight: '700' }}>{item.name}</Text>
          <Pressable onPress={() => Linking.openURL(`mailto:${item.email}`)}>
            <Text style={{ color: colors.primary }}>{item.email}</Text>
          </Pressable>
          <Text
            style={{ color: item.isAdmin ? colors.success : colors.danger }}
          >
            {item.isAdmin ? 'Admin' : 'User'}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Button
              small
              variant="light"
              title="Edit"
              onPress={() => navigation.navigate('UserEdit', { id: item._id })}
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
  id: { fontSize: 11, color: colors.textMuted },
});

export default UserListScreen;
