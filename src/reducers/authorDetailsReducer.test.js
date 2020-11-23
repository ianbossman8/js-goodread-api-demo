import reducer, { initialState } from './searchResults'
import { actions } from '../actions/searchResults'

describe.only('search results reducer', () => {
  it('should retturn inital state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle SEARCH_RESULT_FETCHING', () => {
    expect(reducer(initialState, actions.fetchingSearchResult())).toEqual({
      ...initialState,
      fetching: true,
    })
  })

  it('should handle SEARCH_RESULT_ERROR', () => {
    expect(reducer(initialState, actions.errorSearchResult('error'))).toEqual({
      ...initialState,
      error: 'error',
    })
  })

  it('should handle SEARCH_RESULT_RECEIVED', () => {})
})
