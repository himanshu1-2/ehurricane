import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { Field } from '../components/Field';
import Button from '../components/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';
import { colors } from '../theme';

const LoginScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const { loading, error, userInfo } = useSelector((s) => s.userLogin) || {};
  const redirect = route.params?.redirect;

  useEffect(() => {
    if (userInfo) {
      if (redirect) navigation.replace(redirect);
      else navigation.navigate('Home');
    }
  }, [userInfo, redirect, navigation]);

  const submit = () => dispatch(login(email, password));

  return (
    <FormContainer>
      <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 12 }}>
        Sign In
      </Text>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Field
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
      />
      <Button title="Sign In" onPress={submit} />
      <View style={{ paddingVertical: 12 }}>
        <Text>New Customer?</Text>
        <Pressable
          onPress={() =>
            navigation.navigate('Register', redirect ? { redirect } : {})
          }
        >
          <Text style={{ color: colors.primary, marginTop: 4 }}>Register</Text>
        </Pressable>
      </View>
    </FormContainer>
  );
};

export default LoginScreen;
