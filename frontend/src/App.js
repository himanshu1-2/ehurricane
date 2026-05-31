import { Container } from 'react-bootstrap'
import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Cancel from './screens/Cancel'
import CartScreen from './screens/CartScreen'
import CategoryScreen from './screens/CategoryScreen'
import GenderScreen from './screens/GenderScreen'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import OrderListScreen from './screens/OrderListScreen'
import OrderScreen from './screens/OrderScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductScreen from './screens/ProductScreen'
import CouponListScreen from './screens/CouponListScreen'
import CouponEditScreen from './screens/CouponEditScreen'
import ProfileScreen from './screens/ProfileScreen'
import RegisterScreen from './screens/RegisterScreen'
import VendorRegisterScreen from './screens/VendorRegisterScreen'
import ShippingScreen from './screens/ShippingScreen'
import success from './screens/success'
import UserEditScreen from './screens/UserEditScreen'
import UserListScreen from './screens/UserListScreen'
const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/order/:id' component={OrderScreen} />
          <Route path='/shipping' component={ShippingScreen} />
          <Route path='/payment' component={PaymentScreen} />
          <Route path='/placeorder' component={PlaceOrderScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register/vendor' component={VendorRegisterScreen} exact />
          <Route path='/vendor/cuisines' component={ProductListScreen} exact />
          <Route
            path='/vendor/cuisines/:pageNumber'
            component={ProductListScreen}
            exact
          />
          <Route path='/vendor/product/:id/edit' component={ProductEditScreen} />
          <Route path='/register' component={RegisterScreen} exact />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/product/:id' component={ProductScreen} />
          <Route path='/cart/:id?' component={CartScreen} />
          <Route path='/admin/userlist' component={UserListScreen} />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} />
          <Route path='/success' component={success} />
          <Route path='/cancel' component={Cancel} />
           <Route path='/category/:category' component={CategoryScreen} />
           <Route path='/gender/:gender' component={GenderScreen} />
          <Route
            path='/admin/productlist'
            component={ProductListScreen}
            exact
          />
          <Route
            path='/admin/productlist/:pageNumber'
            component={ProductListScreen}
            exact
          />
          
          <Route path='/admin/product/:id/edit' component={ProductEditScreen} />
          <Route path='/admin/orderlist' component={OrderListScreen} />
          <Route path='/admin/couponlist' component={CouponListScreen} exact />
          <Route path='/admin/coupon/create' component={CouponEditScreen} exact />
          <Route path='/admin/coupon/:id/edit' component={CouponEditScreen} />
          <Route path='/search/:keyword' component={HomeScreen} exact />
          <Route path='/page/:pageNumber' component={HomeScreen} exact />
          <Route
            path='/search/:keyword/page/:pageNumber'
            component={HomeScreen}
            exact
          />
          <Route path='/' component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
