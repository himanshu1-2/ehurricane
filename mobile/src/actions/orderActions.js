import axios from 'axios';
import { ORDERS_URL } from '../constants';
import { storage } from '../storage';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
} from '../constants/orderConstants';
import { logout } from './userActions';

const errMessage = (error) =>
  error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.post(ORDERS_URL, order, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
    dispatch({ type: CART_CLEAR_ITEMS, payload: data });
    await storage.remove('cartItems');
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: ORDER_CREATE_FAIL, payload: message });
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.get(`${ORDERS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
  }
};

export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.put(
      `${ORDERS_URL}/${orderId}/pay`,
      paymentResult,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: ORDER_PAY_FAIL, payload: message });
  }
};

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DELIVER_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.put(
      `${ORDERS_URL}/${order._id}/deliver`,
      {},
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
  }
};

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_MY_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.get(`${ORDERS_URL}/myorders`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: ORDER_LIST_MY_FAIL, payload: message });
  }
};

export const listOrders = (pageNumber = 1) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.get(
      `${ORDERS_URL}?pageNumber=${pageNumber}&pageSize=10`,
      { headers: { Authorization: `Bearer ${userInfo && userInfo.token}` } }
    );
    const payload =
      data && Array.isArray(data.orders)
        ? { orders: data.orders, page: data.page || 1, pages: data.pages || 1 }
        : Array.isArray(data)
        ? { orders: data, page: 1, pages: 1 }
        : {
            orders: data.orders || data,
            page: data.page || 1,
            pages: data.pages || 1,
          };
    dispatch({ type: ORDER_LIST_SUCCESS, payload });
  } catch (error) {
    dispatch({ type: ORDER_LIST_FAIL, payload: errMessage(error) });
  }
};
