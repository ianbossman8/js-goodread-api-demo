import { ACTION_CONSTANTS } from '../actions/searchResultActions'

export const initialState = {
  fetching: false,
  error: '',
  results: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_CONSTANTS.SEARCH_RESULT_FETCHING:
      return {
        ...state,
        fetching: true,
      }
    case ACTION_CONSTANTS.SEARCH_RESULT_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case ACTION_CONSTANTS.SEARCH_RESULT_RECEIVED:
      const { result } = action

      return {
        ...state,
        fetching: false,
        results: {
          query: result.query,
          work: result.results.work ? result.results.work : [],
          totalResults: result['total-results'],
        },
        error: '',
      }
    default:
      return state
  }
}
