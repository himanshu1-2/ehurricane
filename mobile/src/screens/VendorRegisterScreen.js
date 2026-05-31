import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { Field, Select } from '../components/Field';
import Button from '../components/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { registerVendor } from '../actions/vendorActions';
import { colors } from '../theme';

const VendorRegisterScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector((s) => s.vendorRegister) || {};
  const redirect = route.params?.redirect;

  useEffect(() => {
    if (userInfo) {
      if (redirect) navigation.replace(redirect);
      else navigation.navigate('Home');
    }
  }, [userInfo, redirect, navigation]);

  const submit = () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage(null);
    dispatch(
      registerVendor({
        name,
        email,
        password,
        shopName,
        description,
        foodType,
        address: { line1: addressLine, city, state, postalCode },
        contact: { email, phone: contactPhone },
      })
    );
  };

  return (
    <FormContainer>
      <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 12 }}>
        Register as Vendor
      </Text>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Text style={{ fontWeight: '700', marginBottom: 4 }}>Account</Text>
      <Field label="Owner Name" value={name} onChangeText={setName} autoCapitalize="words" />
      <Field label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Field
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Text style={{ fontWeight: '700', marginVertical: 4 }}>Shop</Text>
      <Field
        label="Shop Name"
        value={shopName}
        onChangeText={setShopName}
        placeholder="e.g. Maa Annapurna Tiffins"
      />
      <Field
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Short description"
        multiline
      />
      <Select
        label="Food Type"
        value={foodType}
        onChange={setFoodType}
        items={[
          { label: 'Veg', value: 'veg' },
          { label: 'Non-Veg', value: 'non-veg' },
          { label: 'Both', value: 'both' },
        ]}
      />

      <Text style={{ fontWeight: '700', marginVertical: 4 }}>Address</Text>
      <Field label="Address Line" value={addressLine} onChangeText={setAddressLine} />
      <Field label="City" value={city} onChangeText={setCity} />
      <Field label="State" value={state} onChangeText={setState} />
      <Field label="Postal Code" value={postalCode} onChangeText={setPostalCode} />

      <Text style={{ fontWeight: '700', marginVertical: 4 }}>Contact</Text>
      <Field
        label="Phone"
        value={contactPhone}
        onChangeText={setContactPhone}
        keyboardType="phone-pad"
      />

      <Button title="Register Vendor" onPress={submit} />

      <View style={{ paddingVertical: 12 }}>
        <Pressable
          onPress={() =>
            navigation.navigate('Login', redirect ? { redirect } : {})
          }
        >
          <Text style={{ color: colors.primary }}>Already have an account? Login</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate('Register', redirect ? { redirect } : {})
          }
          style={{ marginTop: 8 }}
        >
          <Text style={{ color: colors.primary }}>Sign up as Customer</Text>
        </Pressable>
      </View>
    </FormContainer>
  );
};

export default VendorRegisterScreen;
