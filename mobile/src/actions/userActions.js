import axios from 'axios';
import { USERS_URL } from '../constants';
import { storage } from '../storage';
import { resetTo } from '../navigationRef';
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_FAIL,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,
} from '../constants/userConstants';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';

const errMessage = (error) =>
  error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const { data } = await axios.post(
      `${USERS_URL}/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    await storage.setJSON('userInfo', data);
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL, payload: errMessage(error) });
  }
};

export const logout = () => async (dispatch) => {
  await storage.remove('userInfo');
  await storage.remove('cartItems');
  await storage.remove('shippingAddress');
  await storage.remove('paymentMethod');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });
  resetTo('Login');
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const { data } = await axios.post(
      USERS_URL,
      { name, email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    await storage.setJSON('userInfo', data);
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: errMessage(error) });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.get(`${USERS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: USER_DETAILS_FAIL, payload: message });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.put(`${USERS_URL}/profile`, user, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    await storage.setJSON('userInfo', data);
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: USER_UPDATE_PROFILE_FAIL, payload: message });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.get(USERS_URL, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: USER_LIST_FAIL, payload: message });
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    await axios.delete(`${USERS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: USER_DELETE_FAIL, payload: message });
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const { data } = await axios.put(`${USERS_URL}/${user._id}`, user, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: USER_UPDATE_SUCCESS });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    dispatch({ type: USER_DETAILS_RESET });
  } catch (error) {
    const message = errMessage(error);
    if (message === 'Not authorized, token failed') dispatch(logout());
    dispatch({ type: USER_UPDATE_FAIL, payload: message });
  }
};
