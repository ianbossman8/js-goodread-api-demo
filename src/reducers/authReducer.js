import { ACTION_CONSTANTS } from '../actions/authActions'

export const initialState = {
  isAuth: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_CONSTANTS.AUTH:
      return {
        isAuth: true,
      }
    default:
      return state
  }
}
