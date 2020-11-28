import reducer, { initialState } from './searchResultsReducer'
import { actions } from '../actions/searchResultActions'

describe('search results reducer', () => {
  it('should retturn inital state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle SEARCH_RESULT_FETCHING', () => {
    expect(reducer(initialState, actions.fetchingSearchResult())).toEqual({
      ...initialState,
      fetching: true,
      error: '',
    })
  })

  it('should handle SEARCH_RESULT_ERROR', () => {
    expect(reducer(initialState, actions.errorSearchResult('error'))).toEqual({
      ...initialState,
      error: 'error',
      fetching: false,
    })
  })

  it('should handle SEARCH_RESULT_RECEIVED', () => {
    let result = {
      query: 'query',
      results: {
        work: ['work'],
      },
      'total-results': 1,
    }

    expect(reducer(initialState, actions.receivedSearchResults(result))).toEqual({
      ...initialState,
      fetching: false,
      results: {
        query: 'query',
        work: ['work'],
        totalResults: 1,
      },
    })

    result = {
      ...result,
      results: {},
      'total-results': 0,
    }

    const updatedState = {
      ...initialState,
      error: 'error',
    }

    expect(reducer(updatedState, actions.receivedSearchResults(result))).toEqual({
      ...initialState,
      fetching: false,
      results: {
        query: 'query',
        work: [],
        totalResults: 0,
      },
      error: '',
    })
  })
})
