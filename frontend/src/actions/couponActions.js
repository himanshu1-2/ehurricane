import axios from 'axios'
import {
  COUPON_LIST_REQUEST,
  COUPON_LIST_SUCCESS,
  COUPON_LIST_FAIL,
  COUPON_DETAILS_REQUEST,
  COUPON_DETAILS_SUCCESS,
  COUPON_DETAILS_FAIL,
  COUPON_DELETE_REQUEST,
  COUPON_DELETE_SUCCESS,
  COUPON_DELETE_FAIL,
  COUPON_CREATE_REQUEST,
  COUPON_CREATE_SUCCESS,
  COUPON_CREATE_FAIL,
  COUPON_UPDATE_REQUEST,
  COUPON_UPDATE_SUCCESS,
  COUPON_UPDATE_FAIL,
  COUPON_APPLICABLE_REQUEST,
  COUPON_APPLICABLE_SUCCESS,
  COUPON_APPLICABLE_FAIL,
} from '../constants/couponConstants'
import { logout } from './userActions'

const authConfig = (userInfo, json = false) => ({
  headers: {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${userInfo.token}`,
  },
})

const errMessage = (error) =>
  error.response && error.response.data.message
    ? error.response.data.message
    : error.message

export const listCoupons = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_LIST_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/coupons`,
      authConfig(userInfo)
    )

    dispatch({ type: COUPON_LIST_SUCCESS, payload: data })
  } catch (error) {
    const message = errMessage(error)
    if (message === 'Not authorized, token failed') dispatch(logout())
    dispatch({ type: COUPON_LIST_FAIL, payload: message })
  }
}

export const listCouponDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_DETAILS_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/coupons/${id}`,
      authConfig(userInfo)
    )

    dispatch({ type: COUPON_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message = errMessage(error)
    if (message === 'Not authorized, token failed') dispatch(logout())
    dispatch({ type: COUPON_DETAILS_FAIL, payload: message })
  }
}

export const deleteCoupon = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_DELETE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/coupons/${id}`,
      authConfig(userInfo)
    )

    dispatch({ type: COUPON_DELETE_SUCCESS })
  } catch (error) {
    const message = errMessage(error)
    if (message === 'Not authorized, token failed') dispatch(logout())
    dispatch({ type: COUPON_DELETE_FAIL, payload: message })
  }
}

export const createCoupon = (coupon) => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_CREATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/coupons`,
      coupon,
      authConfig(userInfo, true)
    )

    dispatch({ type: COUPON_CREATE_SUCCESS, payload: data })
  } catch (error) {
    const message = errMessage(error)
    if (message === 'Not authorized, token failed') dispatch(logout())
    dispatch({ type: COUPON_CREATE_FAIL, payload: message })
  }
}

export const getApplicableCoupon = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_APPLICABLE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/coupons/applicable`,
      authConfig(userInfo)
    )

    dispatch({ type: COUPON_APPLICABLE_SUCCESS, payload: data })
  } catch (error) {
    const message = errMessage(error)
    if (message === 'Not authorized, token failed') dispatch(logout())
    dispatch({ type: COUPON_APPLICABLE_FAIL, payload: message })
  }
}

export const updateCoupon = (coupon) => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_UPDATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/coupons/${coupon._id}`,
      coupon,
      authConfig(userInfo, true)
    )

    dispatch({ type: COUPON_UPDATE_SUCCESS, payload: data })
    dispatch({ type: COUPON_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message = errMessage(error)
    if (message === 'Not authorized, token failed') dispatch(logout())
    dispatch({ type: COUPON_UPDATE_FAIL, payload: message })
  }
}
