import { useEffect } from 'react'
import { Button, Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { listTopProducts } from '../actions/productActions'
import '../styles/ProductCarousel.css'; // new stylesheet for premium look
import Loader from './Loader'
import Message from './Message'
import React from 'react'
const PLACEHOLDER = '/images/sample.jpg'

const ProductCarousel = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products = [] } = productTopRated || {}

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  if (loading) return <Loader />
  if (error) return <Message variant='danger'>{error}</Message>
  if (!Array.isArray(products) || products.length === 0) return null

  return (
    <Carousel
      fade
      interval={2000}
      pause='hover'
      controls
      indicators
      touch
      keyboard
      className='premium-carousel'
      aria-label='Featured products'
    >
      {products.slice(0, 8).map((product) => (
        <Carousel.Item key={product._id} className='carousel-item-premium'>
          <div
            role='link'
            tabIndex={0}
            className='carousel-link'
            aria-label={`View ${product.name}`}
            onClick={() => history.push(`/product/${product._id}`)}
            onKeyPress={(e) => { if (e.key === 'Enter') history.push(`/product/${product._id}`) }}
          >
            <div className='premium-slide'>

              <Image
                className='carousel-img'
                src={product.image || PLACEHOLDER}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = PLACEHOLDER
                }}
                loading='lazy'
              />
              <div className='slide-gradient' aria-hidden='true' />
              <div className='slide-overlay'>
                <div className='overlay-top'>
                  {product.isNew && <span className='badge-new'>New</span>}
                  {product.discount && <span className='badge-sale'>-{product.discount}%</span>}
                </div>

                <h3 className='overlay-title'>{product.name}</h3>

                <div className='overlay-meta'>
                  <span className='overlay-brand'>{product.brand}</span>
                  <div className='overlay-price'>
                    <span className='price-current'>₹ {Number(product.price).toFixed(0)}</span>
                    {product.oldPrice && <span className='price-old'>₹ {Number(product.oldPrice).toFixed(0)}</span>}
                  </div>
                </div>

               
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
