import reducer, { initialState } from './authorFollowersReducer'
import { actions } from '../actions/getAuthorFollowersActions'

describe('author followers reducer', () => {
  it('should retturn inital state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle AUTHOR_FOLLOWERS_FETCHING', () => {
    expect(reducer(initialState, actions.fetchingAuthorFollowers())).toEqual({
      ...initialState,
      fetching: true,
      error: '',
    })
  })

  it('should handle AUTHOR_FOLLOWERS_ERROR', () => {
    expect(reducer(initialState, actions.errorAuthorFollowers('error'))).toEqual({
      ...initialState,
      error: 'error',
      fetching: false,
    })
  })

  it('should handle AUTHOR_FOLLOWERS_RECEIVED', () => {
    let result = {}

    expect(reducer(initialState, actions.receivedAuthorFollowers(result))).toEqual({
      ...initialState,
      fetching: false,
      results: {},
      error: '',
    })
  })
})
