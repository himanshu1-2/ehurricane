import axios from 'axios';
import { PRODUCTS_URL } from '../constants';
import { storage } from '../storage';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`${PRODUCTS_URL}/${id}`);
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });
  await storage.setJSON('cartItems', getState().cart.cartItems);
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: id });
  await storage.setJSON('cartItems', getState().cart.cartItems);
};

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
  await storage.setJSON('shippingAddress', data);
};

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
  await storage.setJSON('paymentMethod', data);
};
