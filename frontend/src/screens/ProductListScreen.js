import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  listProducts,
  listMyProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const isAdmin = userInfo && userInfo.isAdmin
  const isVendor = userInfo && userInfo.role === 'vendor' && !isAdmin
  const vendorMode = match.path.startsWith('/vendor') || isVendor

  const listBasePath = vendorMode ? '/vendor/cuisines' : '/admin/productlist'
  const editBasePath = vendorMode ? '/vendor/product' : '/admin/product'
  const heading = vendorMode ? 'My Cuisines' : 'Products'
  const createLabel = vendorMode ? 'Add Cuisine' : 'Create Product'

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo || (!isAdmin && !isVendor)) {
      history.push('/login')
      return
    }

    if (successCreate) {
      history.push(`${editBasePath}/${createdProduct._id}/edit`)
    } else if (vendorMode) {
      dispatch(listMyProducts('', pageNumber))
    } else {
      dispatch(listProducts('', pageNumber))
    }
  }, [
    dispatch,
    history,
    userInfo,
    isAdmin,
    isVendor,
    vendorMode,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
    editBasePath,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>{heading}</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> {createLabel}
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
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
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>₹ {product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`${editBasePath}/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={pages}
            page={page}
            isAdmin={!vendorMode}
            basePath={listBasePath}
          />
        </>
      )}
    </>
  )
}

export default ProductListScreen
