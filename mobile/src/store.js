import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
} from './reducers/orderReducers';
import {
  couponListReducer,
  couponDetailsReducer,
  couponDeleteReducer,
  couponCreateReducer,
  couponUpdateReducer,
  couponApplicableReducer,
} from './reducers/couponReducers';
import { vendorRegisterReducer } from './reducers/vendorReducers';
import { storage } from './storage';

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  couponList: couponListReducer,
  couponDetails: couponDetailsReducer,
  couponDelete: couponDeleteReducer,
  couponCreate: couponCreateReducer,
  couponUpdate: couponUpdateReducer,
  couponApplicable: couponApplicableReducer,
  vendorRegister: vendorRegisterReducer,
});

const store = createStore(reducer, undefined, compose(applyMiddleware(thunk)));

export const hydrateStore = async () => {
  const [cartItems, shippingAddress, userInfo, paymentMethod] = await Promise.all([
    storage.getJSON('cartItems', []),
    storage.getJSON('shippingAddress', {}),
    storage.getJSON('userInfo', null),
    storage.getJSON('paymentMethod', null),
  ]);

  if (Array.isArray(cartItems)) {
    cartItems.forEach((item) =>
      store.dispatch({ type: 'CART_ADD_ITEM', payload: item })
    );
  }
  if (shippingAddress && Object.keys(shippingAddress).length) {
    store.dispatch({
      type: 'CART_SAVE_SHIPPING_ADDRESS',
      payload: shippingAddress,
    });
  }
  if (paymentMethod) {
    store.dispatch({ type: 'CART_SAVE_PAYMENT_METHOD', payload: paymentMethod });
  }
  if (userInfo) {
    store.dispatch({ type: 'USER_LOGIN_SUCCESS', payload: userInfo });
  }
};

export default store;
