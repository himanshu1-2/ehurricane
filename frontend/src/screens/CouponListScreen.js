import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listCoupons, deleteCoupon } from '../actions/couponActions'
import { COUPON_CREATE_RESET } from '../constants/couponConstants'

const CouponListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const couponList = useSelector((state) => state.couponList)
  const { loading, error, coupons } = couponList

  const couponDelete = useSelector((state) => state.couponDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = couponDelete

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: COUPON_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
      return
    }

    dispatch(listCoupons())
  }, [dispatch, history, userInfo, successDelete])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCoupon(id))
    }
  }

  const createHandler = () => {
    history.push('/admin/coupon/create')
  }

  const formatDiscount = (c) =>
    c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Coupons</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createHandler}>
            <i className='fas fa-plus'></i> Create Coupon
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>CODE</th>
              <th>DISCOUNT</th>
              <th>MIN CART</th>
              <th>FIRST-TIME</th>
              <th>USED / LIMIT</th>
              <th>EXPIRES</th>
              <th>ACTIVE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.code}</strong></td>
                <td>{formatDiscount(c)}</td>
                <td>₹{c.minCartValue || 0}</td>
                <td>
                  {c.firstTimeOnly ? (
                    <Badge variant='info'>Yes</Badge>
                  ) : (
                    <Badge variant='secondary'>No</Badge>
                  )}
                </td>
                <td>
                  {c.usedCount || 0} / {c.usageLimit ? c.usageLimit : '∞'}
                </td>
                <td>
                  {c.expiresAt
                    ? new Date(c.expiresAt).toLocaleDateString()
                    : '—'}
                </td>
                <td>
                  {c.isActive ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/coupon/${c._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(c._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default CouponListScreen
