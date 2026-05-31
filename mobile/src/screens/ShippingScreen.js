import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { Field } from '../components/Field';
import Button from '../components/Button';
import { saveShippingAddress } from '../actions/cartActions';
import { USERS_URL } from '../constants';

const ShippingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { shippingAddress: cartShipping = {} } = useSelector((s) => s.cart) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};

  const sa = userInfo?.shippingAddress || {};
  const [address, setAddress] = useState(cartShipping.address || sa.address || '');
  const [city, setCity] = useState(cartShipping.city || sa.city || '');
  const [postalCode, setPostalCode] = useState(
    cartShipping.postalCode || sa.postalCode || ''
  );
  const [mobile, setMobile] = useState(cartShipping.mobile || sa.mobile || '');

  useEffect(() => {
    setAddress(cartShipping.address || sa.address || '');
    setCity(cartShipping.city || sa.city || '');
    setPostalCode(cartShipping.postalCode || sa.postalCode || '');
    setMobile(cartShipping.mobile || sa.mobile || '');
  }, [
    cartShipping.address,
    cartShipping.city,
    cartShipping.postalCode,
    cartShipping.mobile,
    sa.address,
    sa.city,
    sa.postalCode,
    sa.mobile,
  ]);

  const submit = async () => {
    dispatch(saveShippingAddress({ address, city, postalCode, mobile }));
    if (userInfo?.token) {
      try {
        await axios.put(
          `${USERS_URL}/profile`,
          { shippingAddress: { address, city, postalCode, mobile } },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
      } catch {}
    }
    navigation.navigate('Payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
        Shipping
      </Text>
      <Field label="Address" value={address} onChangeText={setAddress} />
      <Field label="City" value={city} onChangeText={setCity} />
      <Field
        label="Postal Code"
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType="numeric"
      />
      <Field
        label="Mobile"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <Button title="Continue" onPress={submit} />
    </FormContainer>
  );
};

export default ShippingScreen;
