import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingAddress } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer from '../components/FormContainer'
import React from 'react'
const ShippingScreen = ({ history }) => {
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart) || {}
  const { shippingAddress: cartShipping = {} } = cart

  const userLogin = useSelector((state) => state.userLogin) || {}
  const { userInfo } = userLogin || {}

  // initialize from cart first, fallback to user's saved profile shippingAddress if available
  const [address, setAddress] = useState(cartShipping?.address || userInfo?.shippingAddress?.address || '')
  const [city, setCity] = useState(cartShipping?.city || userInfo?.shippingAddress?.city || '')
  const [postalCode, setPostalCode] = useState(cartShipping?.postalCode || userInfo?.shippingAddress?.postalCode || '')
  const [mobile, setMobile] = useState(cartShipping?.mobile || userInfo?.shippingAddress?.mobile || '')

  // keep fields in sync if cart or user profile updates after mount
  useEffect(() => {
    // prefer cart values when present, otherwise use user profile
    setAddress(cartShipping?.address || userInfo?.shippingAddress?.address || '')
    setCity(cartShipping?.city || userInfo?.shippingAddress?.city || '')
    setPostalCode(cartShipping?.postalCode || userInfo?.shippingAddress?.postalCode || '')
    setMobile(cartShipping?.mobile || userInfo?.shippingAddress?.mobile || '')
  }, [cartShipping, userInfo])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, mobile }))
    // also persist to user profile if logged in
    if (userInfo?.token) {
      ;(async () => {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
          await axios.put(
            `${process.env.REACT_APP_BACKEND_URL || ''}/api/users/profile`,
            { shippingAddress: { address, city, postalCode, mobile } },
            config
          )
        } catch (err) {
          // optional: handle error (toast/log). keep silent to not block checkout
          // console.error('Failed to save shipping address to profile', err)
        } finally {
          history.push('/payment')
        }
      })()
    } else {
      history.push('/payment')
    }
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='mobile'>
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter Mobile Number'
            value={mobile}
            required
            onChange={(e) => setMobile(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
