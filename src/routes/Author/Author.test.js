import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { render } from '@testing-library/react'
import { AppWrapper } from '../../util/testUtil'
import { ACTION_CONSTANTS } from '../../actions/getAuthorDetailsActions'
import { api } from '../../constant'
import Author from './Author'

describe('Author component', () => {
  const initState = {
    authorDetails: {
      error: '',
      fetching: '',
      results: {},
    },
    authorFollowers: {
      error: '',
      fetching: false,
      results: [{ id: 1, image_url: 'someUrl', name: 'joe1' }],
    },
    auth: {
      isAuth: true,
    },
  }
  const middlewares = [thunk.withExtraArgument({ netlifyEndpoint: api.netlify })]
  const store = configureStore(middlewares)(initState)
  const authorRoute = '/author/123'

  afterEach(() => {
    store.clearActions()
  })

  const wrappedComponent = (route = authorRoute) => (store) => (
    <AppWrapper store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: route,
            state: {
              from: '/',
            },
          },
        ]}
      >
        <Author />
        <Route
          path="*"
          render={({ history, location }) => {
            return null
          }}
        />
      </MemoryRouter>
    </AppWrapper>
  )

  describe('dispatch', () => {
    it('should dispatch action AUTH', () => {
      render(wrappedComponent()(store))

      const expectedActions = [{ type: ACTION_CONSTANTS.AUTHOR_DETAILS_FETCHING }]
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
