import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
  basePath = '',
}) => {
  const linkFor = (n) => {
    if (basePath) return `${basePath}/${n}`
    if (isAdmin) return `/admin/productlist/${n}`
    return keyword ? `/search/${keyword}/page/${n}` : `/page/${n}`
  }

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x + 1} to={linkFor(x + 1)}>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  )
}

export default Paginate
