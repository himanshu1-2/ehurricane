import {
  COUPON_LIST_REQUEST,
  COUPON_LIST_SUCCESS,
  COUPON_LIST_FAIL,
  COUPON_DETAILS_REQUEST,
  COUPON_DETAILS_SUCCESS,
  COUPON_DETAILS_FAIL,
  COUPON_DETAILS_RESET,
  COUPON_DELETE_REQUEST,
  COUPON_DELETE_SUCCESS,
  COUPON_DELETE_FAIL,
  COUPON_CREATE_REQUEST,
  COUPON_CREATE_SUCCESS,
  COUPON_CREATE_FAIL,
  COUPON_CREATE_RESET,
  COUPON_UPDATE_REQUEST,
  COUPON_UPDATE_SUCCESS,
  COUPON_UPDATE_FAIL,
  COUPON_UPDATE_RESET,
  COUPON_APPLICABLE_REQUEST,
  COUPON_APPLICABLE_SUCCESS,
  COUPON_APPLICABLE_FAIL,
  COUPON_APPLICABLE_RESET,
} from '../constants/couponConstants'

export const couponListReducer = (state = { coupons: [] }, action) => {
  switch (action.type) {
    case COUPON_LIST_REQUEST:
      return { loading: true, coupons: [] }
    case COUPON_LIST_SUCCESS:
      return { loading: false, coupons: action.payload }
    case COUPON_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const couponDetailsReducer = (state = { coupon: {} }, action) => {
  switch (action.type) {
    case COUPON_DETAILS_REQUEST:
      return { ...state, loading: true }
    case COUPON_DETAILS_SUCCESS:
      return { loading: false, coupon: action.payload }
    case COUPON_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case COUPON_DETAILS_RESET:
      return { coupon: {} }
    default:
      return state
  }
}

export const couponDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_DELETE_REQUEST:
      return { loading: true }
    case COUPON_DELETE_SUCCESS:
      return { loading: false, success: true }
    case COUPON_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const couponCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_CREATE_REQUEST:
      return { loading: true }
    case COUPON_CREATE_SUCCESS:
      return { loading: false, success: true, coupon: action.payload }
    case COUPON_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case COUPON_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const couponApplicableReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_APPLICABLE_REQUEST:
      return { loading: true }
    case COUPON_APPLICABLE_SUCCESS:
      return { loading: false, applicable: action.payload }
    case COUPON_APPLICABLE_FAIL:
      return { loading: false, error: action.payload }
    case COUPON_APPLICABLE_RESET:
      return {}
    default:
      return state
  }
}

export const couponUpdateReducer = (state = { coupon: {} }, action) => {
  switch (action.type) {
    case COUPON_UPDATE_REQUEST:
      return { loading: true }
    case COUPON_UPDATE_SUCCESS:
      return { loading: false, success: true, coupon: action.payload }
    case COUPON_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case COUPON_UPDATE_RESET:
      return { coupon: {} }
    default:
      return state
  }
}
