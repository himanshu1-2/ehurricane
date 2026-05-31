import axios from 'axios';
import { PRODUCTS_URL } from '../constants';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} from '../constants/productConstants';
import { logout } from './userActions';

const errMessage = (error) =>
  error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;

export const listProducts = (keyword = '', pageNumber = '') => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get(
      `${PRODUCTS_URL}?keyword=${encodeURIComponent(keyword)}&pageNumber=${pageNumber}`
    );
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: errMessage(error) });
  }
};

export const listMyProducts = (keyword = '', pageNumber = '') => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.get(
      `${PRODUCTS_URL}/mine?keyword=${encodeURIComponent(keyword)}&pageNumber=${pageNumber}`,
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: PRODUCT_LIST_FAIL, payload: message });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`${PRODUCTS_URL}/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL, payload: errMessage(error) });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    await axios.delete(`${PRODUCTS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: message });
  }
};

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.post(
      PRODUCTS_URL,
      {},
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
  }
};

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.put(`${PRODUCTS_URL}/${product._id}`, product, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: PRODUCT_UPDATE_FAIL, payload: message });
  }
};

export const createProductReview = (productId, review) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    await axios.post(`${PRODUCTS_URL}/${productId}/reviews`, review, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: PRODUCT_CREATE_REVIEW_FAIL, payload: message });
  }
};

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST });
    const { data } = await axios.get(`${PRODUCTS_URL}/top`);
    dispatch({ type: PRODUCT_TOP_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_TOP_FAIL, payload: errMessage(error) });
  }
};
