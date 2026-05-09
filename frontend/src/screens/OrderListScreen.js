import { useEffect, useState } from 'react'
import { Button, Pagination, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { listOrders } from '../actions/orderActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import React from 'react'
const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const [pageNumber, setPageNumber] = useState(1)

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders, page, pages } = orderList || {}

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // Normalize orders to an array if backend returned object shape
  const orderItems = Array.isArray(orders)
    ? orders
    : orders && Array.isArray(orders.orders)
    ? orders.orders
    : []

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders(pageNumber))
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, pageNumber])

  const changePage = (p) => {
    if (p < 1 || p > (pages || 1)) return
    setPageNumber(p)
    // dispatch will run because pageNumber is in useEffect deps
  }

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            
            <tbody>
              {orderItems.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt ? order.createdAt.substring(0, 10) : ''}</td>
                  <td>₹ {Number(order.totalPrice).toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt ? order.paidAt.substring(0, 10) : 'Yes'
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt ? order.deliveredAt.substring(0, 10) : 'Yes'
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant='light' className='btn-sm'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {(pages && pages > 1) || (page && page > 1) ? (
            <div className='d-flex justify-content-center'>
              <Pagination>
                <Pagination.Prev onClick={() => changePage((pageNumber || page || 1) - 1)} disabled={(pageNumber || page || 1) === 1} />
                {Array.from({ length: pages || page || 1 }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === (pageNumber || page || 1)}
                    onClick={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => changePage((pageNumber || page || 1) + 1)} disabled={(pageNumber || page || 1) === (pages || page || 1)} />
              </Pagination>
            </div>
          ) : null}
        </>
      )}
    </>
  )
}

export default OrderListScreen
