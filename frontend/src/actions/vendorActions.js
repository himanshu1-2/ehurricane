import axios from 'axios'
import {
  VENDOR_REGISTER_REQUEST,
  VENDOR_REGISTER_SUCCESS,
  VENDOR_REGISTER_FAIL,
} from '../constants/vendorConstants'
import { USER_LOGIN_SUCCESS } from '../constants/userConstants'

export const registerVendor = (vendorData) => async (dispatch) => {
  try {
    dispatch({ type: VENDOR_REGISTER_REQUEST })

    const config = {
      headers: { 'Content-Type': 'application/json' },
    }

    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/vendors/register`,
      vendorData,
      config
    )

    dispatch({ type: VENDOR_REGISTER_SUCCESS, payload: data })
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: VENDOR_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
