import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { Field, Select, Check } from '../components/Field';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  listCouponDetails,
  createCoupon,
  updateCoupon,
} from '../actions/couponActions';
import {
  COUPON_CREATE_RESET,
  COUPON_UPDATE_RESET,
  COUPON_DETAILS_RESET,
} from '../constants/couponConstants';

const CouponEditScreen = ({ route, navigation }) => {
  const couponId = route.params?.id;
  const isEdit = Boolean(couponId);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('fixed');
  const [discountValue, setDiscountValue] = useState('0');
  const [minCartValue, setMinCartValue] = useState('0');
  const [firstTimeOnly, setFirstTimeOnly] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [usageLimit, setUsageLimit] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const dispatch = useDispatch();
  const { loading, error, coupon = {} } =
    useSelector((s) => s.couponDetails) || {};
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = useSelector((s) => s.couponCreate) || {};
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((s) => s.couponUpdate) || {};
  const { userInfo } = useSelector((s) => s.userLogin) || {};

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigation.replace('Login');
      return;
    }
    if (successCreate || successUpdate) {
      dispatch({ type: COUPON_CREATE_RESET });
      dispatch({ type: COUPON_UPDATE_RESET });
      dispatch({ type: COUPON_DETAILS_RESET });
      navigation.navigate('CouponList');
      return;
    }
    if (isEdit) {
      if (!coupon._id || coupon._id !== couponId) {
        dispatch(listCouponDetails(couponId));
      } else {
        setCode(coupon.code || '');
        setDescription(coupon.description || '');
        setDiscountType(coupon.discountType || 'fixed');
        setDiscountValue(String(coupon.discountValue || 0));
        setMinCartValue(String(coupon.minCartValue || 0));
        setFirstTimeOnly(Boolean(coupon.firstTimeOnly));
        setExpiresAt(
          coupon.expiresAt
            ? new Date(coupon.expiresAt).toISOString().slice(0, 10)
            : ''
        );
        setUsageLimit(String(coupon.usageLimit || 0));
        setIsActive(coupon.isActive !== undefined ? coupon.isActive : true);
      }
    }
  }, [
    dispatch,
    navigation,
    userInfo,
    isEdit,
    couponId,
    coupon,
    successCreate,
    successUpdate,
  ]);

  const submit = () => {
    const payload = {
      code: code.trim().toUpperCase(),
      description,
      discountType,
      discountValue: Number(discountValue),
      minCartValue: Number(minCartValue),
      firstTimeOnly,
      expiresAt: expiresAt || null,
      usageLimit: Number(usageLimit),
      isActive,
    };
    if (isEdit) dispatch(updateCoupon({ _id: couponId, ...payload }));
    else dispatch(createCoupon(payload));
  };

  return (
    <FormContainer>
      <Button
        variant="light"
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
      <Text style={{ fontSize: 22, fontWeight: '800', marginVertical: 8 }}>
        {isEdit ? 'Edit Coupon' : 'Create Coupon'}
      </Text>
      {(loadingCreate || loadingUpdate) && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {isEdit && loading ? (
        <Loader />
      ) : isEdit && error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Field
            label="Code"
            value={code}
            onChangeText={setCode}
            placeholder="e.g. WELCOME100"
            autoCapitalize="characters"
          />
          <Field
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="₹100 off on your first order"
          />
          <Select
            label="Discount Type"
            value={discountType}
            onChange={setDiscountType}
            items={[
              { label: 'Fixed (₹)', value: 'fixed' },
              { label: 'Percent (%)', value: 'percent' },
            ]}
          />
          <Field
            label="Discount Value"
            value={discountValue}
            onChangeText={setDiscountValue}
            keyboardType="numeric"
          />
          <Field
            label="Minimum Cart Value (₹)"
            value={minCartValue}
            onChangeText={setMinCartValue}
            keyboardType="numeric"
          />
          <Check
            label="First-time users only"
            value={firstTimeOnly}
            onChange={setFirstTimeOnly}
          />
          <Field
            label="Expires At (YYYY-MM-DD, optional)"
            value={expiresAt}
            onChangeText={setExpiresAt}
            placeholder="2026-12-31"
          />
          <Field
            label="Usage Limit (0 = unlimited)"
            value={usageLimit}
            onChangeText={setUsageLimit}
            keyboardType="numeric"
          />
          <Check label="Active" value={isActive} onChange={setIsActive} />
          <Button
            title={isEdit ? 'Update' : 'Create'}
            onPress={submit}
          />
        </>
      )}
    </FormContainer>
  );
};

export default CouponEditScreen;
