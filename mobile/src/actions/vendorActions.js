import axios from 'axios';
import { VENDORS_URL } from '../constants';
import { storage } from '../storage';
import {
  VENDOR_REGISTER_REQUEST,
  VENDOR_REGISTER_SUCCESS,
  VENDOR_REGISTER_FAIL,
} from '../constants/vendorConstants';
import { USER_LOGIN_SUCCESS } from '../constants/userConstants';

const errMessage = (error) =>
  error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;

export const registerVendor = (vendorData) => async (dispatch) => {
  try {
    dispatch({ type: VENDOR_REGISTER_REQUEST });
    const { data } = await axios.post(`${VENDORS_URL}/register`, vendorData, {
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch({ type: VENDOR_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    await storage.setJSON('userInfo', data);
  } catch (error) {
    dispatch({ type: VENDOR_REGISTER_FAIL, payload: errMessage(error) });
  }
};
