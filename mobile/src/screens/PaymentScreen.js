import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { Select } from '../components/Field';
import Button from '../components/Button';
import Message from '../components/Message';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { shippingAddress = {} } = useSelector((s) => s.cart) || {};
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  useEffect(() => {
    if (!shippingAddress.address) navigation.replace('Shipping');
  }, [shippingAddress.address, navigation]);

  const submit = () => {
    dispatch(savePaymentMethod(paymentMethod));
    navigation.navigate('PlaceOrder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
        Payment Method
      </Text>
      <Message variant="info">
        Mobile payment integration is stubbed. Currently routes through "GPay /
        COD". Add Stripe / PayPal RN SDK to wire real charges.
      </Message>
      <Select
        label="Select Method"
        value={paymentMethod}
        onChange={setPaymentMethod}
        items={[
          { label: 'GPay or COD', value: 'PayPal' },
        ]}
      />
      <Button title="Continue" onPress={submit} />
    </FormContainer>
  );
};

export default PaymentScreen;
