import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { registerVendor } from '../actions/vendorActions'

const VendorRegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [foodType, setFoodType] = useState('veg')

  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const [contactPhone, setContactPhone] = useState('')

  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const vendorRegister = useSelector((s) => s.vendorRegister)
  const { loading, error, userInfo } = vendorRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    setMessage(null)

    dispatch(
      registerVendor({
        name,
        email,
        password,
        shopName,
        description,
        foodType,
        address: {
          line1: addressLine,
          city,
          state,
          postalCode,
        },
        contact: {
          email,
          phone: contactPhone,
        },
      })
    )
  }

  return (
    <FormContainer>
      <h1>Register as Vendor</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <h4>Account</h4>
        <Form.Group controlId='name'>
          <Form.Label>Owner Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <h4 className='mt-3'>Shop</h4>
        <Form.Group controlId='shopName'>
          <Form.Label>Shop Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='e.g. Maa Annapurna Tiffins'
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='description'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as='textarea'
            rows={2}
            placeholder='Short description of your tiffin service'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='foodType'>
          <Form.Label>Food Type</Form.Label>
          <Form.Control
            as='select'
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
          >
            <option value='veg'>Veg</option>
            <option value='non-veg'>Non-Veg</option>
            <option value='both'>Both</option>
          </Form.Control>
        </Form.Group>

        <h4 className='mt-3'>Address</h4>
        <Form.Group controlId='addressLine'>
          <Form.Label>Address Line</Form.Label>
          <Form.Control
            type='text'
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId='city'>
              <Form.Label>City</Form.Label>
              <Form.Control
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='state'>
              <Form.Label>State</Form.Label>
              <Form.Control
                type='text'
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Form.Group>

        <h4 className='mt-3'>Contact</h4>
        <Form.Group controlId='contactPhone'>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type='tel'
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Register Vendor
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          Registering as a customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            User sign up
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default VendorRegisterScreen
