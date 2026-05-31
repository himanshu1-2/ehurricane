import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { Field, Check } from '../components/Field';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = ({ route, navigation }) => {
  const userId = route.params?.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, user = {} } =
    useSelector((s) => s.userDetails) || {};
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((s) => s.userUpdate) || {};

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigation.navigate('UserList');
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, navigation, userId, user, successUpdate]);

  const submit = () =>
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));

  return (
    <FormContainer>
      <Button
        variant="light"
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
      <Text style={{ fontSize: 22, fontWeight: '800', marginVertical: 8 }}>
        Edit User
      </Text>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
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
          <Check label="Is Admin" value={isAdmin} onChange={setIsAdmin} />
          <Button title="Update" onPress={submit} />
        </>
      )}
    </FormContainer>
  );
};

export default UserEditScreen;
