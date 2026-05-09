import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Pagination, Row } from 'react-bootstrap';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import '../styles/theme.css';
import React from 'react'
const CategoryScreen = () => {
  const { category } = useParams();
  const location = useLocation()
  const history = useHistory()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const pageNumber = Number(new URLSearchParams(location.search).get('page') || 1)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null)
        const url = `${process.env.REACT_APP_BACKEND_URL || ''}/api/products?category=${encodeURIComponent(
          category || ''
        )}&pageNumber=${pageNumber}`
        const { data } = await axios.get(url)
        // backend returns { products, page, pages } (or data.products)
        setProducts(data.products || [])
        setPage(data.page || pageNumber)
        setPages(data.pages || 1)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, pageNumber])

  const changePage = (p) => {
    if (p < 1 || p > pages) return
    const base = `/category/${encodeURIComponent(category || '')}`
    history.push(`${base}?page=${p}`)
  }

  return (
    
    <div className="app-container">
      <header className="hero">
        <div className="container">
          <h1 className="center">{category ? category : 'All Products'}</h1>
          <p className="center small-muted">Curated collection — quality products chosen to delight your customers.</p>
        </div>
      </header>

      <main>
        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <Row className="product-grid">
            {products.map((p) => (
              <Col key={p._id}>
                <Card className="product-card h-100">
                  <Link to={`/product/${p._id}`} className="card-img-link">
                    <div className="card-img-wrap">
                      <Card.Img variant="top" src={p.image} alt={p.name} loading="lazy" />
                    </div>
                  </Link>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="product-title">{p.name}</Card.Title>
                    <Card.Text className="product-meta small-muted">{p.brand}</Card.Text>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <div className="price">₹ {p.price.toFixed(2)}</div>
                      <div>
                        <Link to={`/product/${p._id}`} className="btn btn-sm btn-outline-secondary me-2">View</Link>
                        <Button variant="primary" size="sm">Add</Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        {pages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev onClick={() => changePage(page - 1)} disabled={page <= 1} />
              {Array.from({ length: pages }, (_, i) => (
                <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => changePage(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => changePage(page + 1)} disabled={page >= pages} />
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryScreen;