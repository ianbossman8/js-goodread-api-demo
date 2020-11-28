import { ACTION_CONSTANTS } from '../actions/getAuthorFollowersActions'

export const initialState = {
  fetching: false,
  error: '',
  results: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_CONSTANTS.AUTHOR_FOLLOWERS_FETCHING:
      return {
        results: [],
        fetching: true,
        error: '',
      }
    case ACTION_CONSTANTS.AUTHOR_FOLLOWERS_ERROR:
      return {
        ...state,
        error: action.error,
        fetching: false,
      }
    case ACTION_CONSTANTS.AUTHOR_FOLLOWERS_RESET:
      return initialState
    case ACTION_CONSTANTS.AUTHOR_FOLLOWERS_RECEIVED:
      const { result } = action

      return {
        fetching: false,
        results: result,
        error: '',
      }
    default:
      return state
  }
}
