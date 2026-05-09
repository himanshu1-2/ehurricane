import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Row, Col, Pagination } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'

const GenderScreen = ({ match, location, history }) => {
  const gender = match.params.gender || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const pageNumber = new URLSearchParams(location.search).get('page') || 1

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || ''}/api/products?gender=${encodeURIComponent(
            gender
          )}&pageNumber=${pageNumber}`
        )
        // backend may return { products, page, pages } or an array
        const gotProducts = Array.isArray(data) ? data : data.products || data.orders || []
        setProducts(gotProducts)
        setPage(data.page || Number(pageNumber) || 1)
        setPages(data.pages || 1)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        setError(
          err.response && err.response.data.message ? err.response.data.message : err.message
        )
      }
    }
    fetchProducts()
  }, [gender, pageNumber])

  const changePage = (p) => {
    if (p < 1 || p > pages) return
    history.push(`${match.url}?page=${p}`)
  }

  const title =
    gender === 'male' ? 'Men' : gender === 'female' ? 'Women' : gender === 'unisex' ? 'Unisex' : 'Products'

  return (
    <>
      <h1>{title}</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          {pages > 1 && (
            <div className='d-flex justify-content-center mt-4'>
              <Pagination>
                <Pagination.Prev onClick={() => changePage(page - 1)} disabled={page === 1} />
                {Array.from({ length: pages }, (_, i) => (
                  <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => changePage(i + 1)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => changePage(page + 1)} disabled={page === pages} />
              </Pagination>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default GenderScreen