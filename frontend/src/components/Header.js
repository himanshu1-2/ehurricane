import axios from 'axios'
import { useEffect, useState } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Route } from 'react-router-dom'
import { logout } from '../actions/userActions'
import '../styles/header.css'; // added import
import SearchBox from './SearchBox'
import React from 'react'
const Header = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products/categories`)
        setCategories(data || [])
      } catch (err) {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar expand='lg' collapseOnSelect className='app-navbar'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Ajwani Store</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className='ml-auto'>
              <NavDropdown title='Categories' id='categories'>
                {categories.length === 0 ? (
                  <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                ) : (
                  categories.map((cat) => (
                    <LinkContainer key={cat} to={`/category/${encodeURIComponent(cat)}`}>
                      <NavDropdown.Item>{cat}</NavDropdown.Item>
                    </LinkContainer>
                  ))
                )}
              </NavDropdown>

              {/* separate top-level gender links (Men / Women / Unisex) */}
              <LinkContainer to={`/gender/male`}>
                <Nav.Link>Men</Nav.Link>
              </LinkContainer>
              <LinkContainer to={`/gender/female`}>
                <Nav.Link>Women</Nav.Link>
              </LinkContainer>
              <LinkContainer to={`/gender/unisex`}>
                <Nav.Link>Unisex</Nav.Link>
              </LinkContainer>
              
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/couponlist'>
                    <NavDropdown.Item>Coupons</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
