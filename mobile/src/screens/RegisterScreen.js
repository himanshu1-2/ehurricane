import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { Field } from '../components/Field';
import Button from '../components/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';
import { colors } from '../theme';

const RegisterScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector((s) => s.userRegister) || {};
  const redirect = route.params?.redirect;

  useEffect(() => {
    if (userInfo) {
      if (redirect) navigation.replace(redirect);
      else navigation.navigate('Home');
    }
  }, [userInfo, redirect, navigation]);

  const submit = () => {
    if (password !== confirmPassword) setMessage('Passwords do not match');
    else dispatch(register(name, email, password));
  };

  return (
    <FormContainer>
      <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 12 }}>
        Sign Up
      </Text>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Field label="Name" value={name} onChangeText={setName} placeholder="Enter name" autoCapitalize="words" />
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
      <Field
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        secureTextEntry
      />
      <Button title="Register" onPress={submit} />
      <View style={{ paddingVertical: 12 }}>
        <Text>Have an account?</Text>
        <Pressable
          onPress={() =>
            navigation.navigate('Login', redirect ? { redirect } : {})
          }
        >
          <Text style={{ color: colors.primary, marginTop: 4 }}>Login</Text>
        </Pressable>
      </View>
      <View style={{ paddingTop: 8 }}>
        <Text>Want to sell tiffins?</Text>
        <Pressable
          onPress={() =>
            navigation.navigate('VendorRegister', redirect ? { redirect } : {})
          }
        >
          <Text style={{ color: colors.primary, marginTop: 4 }}>
            Register as Vendor
          </Text>
        </Pressable>
      </View>
    </FormContainer>
  );
};

export default RegisterScreen;
