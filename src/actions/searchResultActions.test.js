import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import getSearchResults, { ACTION_CONSTANTS } from './searchResultActions'
import { api } from '../constant'

const middlewares = [thunk.withExtraArgument({ netlifyEndpoint: api.netlify })]
const mockStore = configureMockStore(middlewares)

describe('getSearchResults actions', () => {
  const store = mockStore({ searchResults: { error: '', fetching: true, results: {} } })
  const url = `${api.netlify}/.netlify/functions/search?q=query&page=1&search=all`
  const expectedActions = [{ type: ACTION_CONSTANTS.SEARCH_RESULT_FETCHING }]

  afterEach(() => {
    fetchMock.restore()
    fetchMock.reset()
    store.clearActions()
  })

  it('should return type SEARCH_RESULT_RECEIVED if success', () => {
    fetchMock.getOnce(url, {
      status: 200,
      body: {
        GoodreadsResponse: {
          search: {},
        },
      },
    })

    const controller = new AbortController()

    return store.dispatch(getSearchResults('query')(controller.signal)).then(() => {
      expect(store.getActions()).toEqual([
        ...expectedActions,
        { type: ACTION_CONSTANTS.SEARCH_RESULT_RECEIVED, result: {} },
      ])
    })
  })

  it('should return type SEARCH_RESULT_ERROR if error', () => {
    fetchMock.getOnce(url, {})

    const controller = new AbortController()

    return store.dispatch(getSearchResults('query')(controller.signal)).then(() => {
      expect(store.getActions()).toEqual([
        ...expectedActions,
        { type: ACTION_CONSTANTS.SEARCH_RESULT_ERROR, error: "Cannot read property 'search' of undefined" },
      ])
    })
  })
})
