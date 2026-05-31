import {
  VENDOR_REGISTER_REQUEST,
  VENDOR_REGISTER_SUCCESS,
  VENDOR_REGISTER_FAIL,
  VENDOR_REGISTER_RESET,
} from '../constants/vendorConstants'

export const vendorRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case VENDOR_REGISTER_REQUEST:
      return { loading: true }
    case VENDOR_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case VENDOR_REGISTER_FAIL:
      return { loading: false, error: action.payload }
    case VENDOR_REGISTER_RESET:
      return {}
    default:
      return state
  }
}
