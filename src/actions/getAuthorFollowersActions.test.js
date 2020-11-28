import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import getAuthorFollowers, { ACTION_CONSTANTS } from './getAuthorFollowersActions'
import { api } from '../constant'

const middlewares = [thunk.withExtraArgument({ netlifyEndpoint: api.netlify })]
const mockStore = configureMockStore(middlewares)

describe('getAuthorFollowers actions', () => {
  const store = mockStore({ authorFollowers: { error: '', fetching: true, results: {} } })
  const url = `${api.netlify}/.netlify/functions/author-followers/123?page=1`
  const expectedActions = [{ type: ACTION_CONSTANTS.AUTHOR_FOLLOWERS_FETCHING }]

  afterEach(() => {
    fetchMock.restore()
    fetchMock.reset()
    store.clearActions()
  })

  it('should return type AUTHOR_FOLLOWERS_RECEIVED if success', () => {
    fetchMock.getOnce(url, {
      status: 200,
      body: {
        GoodreadsResponse: {
          followers: {
            user: {},
          },
        },
      },
    })

    return store.dispatch(getAuthorFollowers(123)).then(() => {
      expect(store.getActions()).toEqual([
        ...expectedActions,
        { type: ACTION_CONSTANTS.AUTHOR_FOLLOWERS_RECEIVED, result: {} },
      ])
    })
  })

  it('should return type AUTHOR_FOLLOWERS_ERROR if error', () => {
    fetchMock.getOnce(url, {})

    return store.dispatch(getAuthorFollowers(123)).then(() => {
      expect(store.getActions()).toEqual([
        ...expectedActions,
        { type: ACTION_CONSTANTS.AUTHOR_FOLLOWERS_ERROR, error: "Cannot read property 'followers' of undefined" },
      ])
    })
  })
})
