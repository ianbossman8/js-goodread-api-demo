import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import getAuthorDetails, { ACTION_CONSTANTS } from './getAuthorDetailsActions'
import { api } from '../constant'

const middlewares = [thunk.withExtraArgument({ netlifyEndpoint: api.netlify })]
const mockStore = configureMockStore(middlewares)

describe('getAuthorDetails actions', () => {
  let store = mockStore({ authorDetails: { error: '', fetching: true, results: {} }, auth: { isAuth: false } })
  const url = `${api.netlify}/.netlify/functions/author/123`
  const expectedActions = [{ type: ACTION_CONSTANTS.AUTHOR_DETAILS_FETCHING }]

  afterEach(() => {
    fetchMock.restore()
    fetchMock.reset()
    store.clearActions()
  })

  it('should return type AUTHOR_DETAILS_RECEIVED if success', () => {
    fetchMock.getOnce(url, {
      status: 200,
      body: {
        GoodreadsResponse: {
          author: {},
        },
      },
    })

    return store.dispatch(getAuthorDetails(123)).then(() => {
      expect(store.getActions()).toEqual([
        ...expectedActions,
        { type: ACTION_CONSTANTS.AUTHOR_DETAILS_RECEIVED, result: {} },
      ])
    })
  })

  it('should return type AUTHOR_DETAILS_ERROR if error', () => {
    fetchMock.getOnce(url, {})

    return store.dispatch(getAuthorDetails(123)).then(() => {
      expect(store.getActions()).toEqual([
        ...expectedActions,
        { type: ACTION_CONSTANTS.AUTHOR_DETAILS_ERROR, error: "Cannot read property 'author' of undefined" },
      ])
    })
  })
})
