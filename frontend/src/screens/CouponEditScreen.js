import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  listCouponDetails,
  createCoupon,
  updateCoupon,
} from '../actions/couponActions'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {
  COUPON_CREATE_RESET,
  COUPON_UPDATE_RESET,
  COUPON_DETAILS_RESET,
} from '../constants/couponConstants'

const CouponEditScreen = ({ match, history }) => {
  const couponId = match.params.id
  const isEdit = Boolean(couponId)

  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [discountType, setDiscountType] = useState('fixed')
  const [discountValue, setDiscountValue] = useState(0)
  const [minCartValue, setMinCartValue] = useState(0)
  const [firstTimeOnly, setFirstTimeOnly] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')
  const [usageLimit, setUsageLimit] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const dispatch = useDispatch()

  const couponDetails = useSelector((state) => state.couponDetails)
  const { loading, error, coupon } = couponDetails

  const couponCreate = useSelector((state) => state.couponCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = couponCreate

  const couponUpdate = useSelector((state) => state.couponUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = couponUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
      return
    }

    if (successCreate || successUpdate) {
      dispatch({ type: COUPON_CREATE_RESET })
      dispatch({ type: COUPON_UPDATE_RESET })
      dispatch({ type: COUPON_DETAILS_RESET })
      history.push('/admin/couponlist')
      return
    }

    if (isEdit) {
      if (!coupon._id || coupon._id !== couponId) {
        dispatch(listCouponDetails(couponId))
      } else {
        setCode(coupon.code || '')
        setDescription(coupon.description || '')
        setDiscountType(coupon.discountType || 'fixed')
        setDiscountValue(coupon.discountValue || 0)
        setMinCartValue(coupon.minCartValue || 0)
        setFirstTimeOnly(Boolean(coupon.firstTimeOnly))
        setExpiresAt(
          coupon.expiresAt
            ? new Date(coupon.expiresAt).toISOString().slice(0, 10)
            : ''
        )
        setUsageLimit(coupon.usageLimit || 0)
        setIsActive(coupon.isActive !== undefined ? coupon.isActive : true)
      }
    }
  }, [
    dispatch,
    history,
    userInfo,
    isEdit,
    couponId,
    coupon,
    successCreate,
    successUpdate,
  ])

  const submitHandler = (e) => {
    e.preventDefault()
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
    }
    if (isEdit) {
      dispatch(updateCoupon({ _id: couponId, ...payload }))
    } else {
      dispatch(createCoupon(payload))
    }
  }

  return (
    <>
      <Link to='/admin/couponlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h1>
        {(loadingCreate || loadingUpdate) && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {isEdit && loading ? (
          <Loader />
        ) : isEdit && error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='code'>
              <Form.Label>Code</Form.Label>
              <Form.Control
                type='text'
                placeholder='e.g. WELCOME100'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='₹100 off on your first order'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='discountType'>
              <Form.Label>Discount Type</Form.Label>
              <Form.Control
                as='select'
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value='fixed'>Fixed (₹)</option>
                <option value='percent'>Percent (%)</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='discountValue'>
              <Form.Label>Discount Value</Form.Label>
              <Form.Control
                type='number'
                min='0'
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='minCartValue'>
              <Form.Label>Minimum Cart Value (₹)</Form.Label>
              <Form.Control
                type='number'
                min='0'
                value={minCartValue}
                onChange={(e) => setMinCartValue(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='firstTimeOnly'>
              <Form.Check
                type='checkbox'
                label='First-time users only'
                checked={firstTimeOnly}
                onChange={(e) => setFirstTimeOnly(e.target.checked)}
              />
            </Form.Group>

            <Form.Group controlId='expiresAt'>
              <Form.Label>Expires At (optional)</Form.Label>
              <Form.Control
                type='date'
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='usageLimit'>
              <Form.Label>Usage Limit (0 = unlimited)</Form.Label>
              <Form.Control
                type='number'
                min='0'
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='isActive'>
              <Form.Check
                type='checkbox'
                label='Active'
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Form.Group>

            <Button type='submit' variant='primary'>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default CouponEditScreen
