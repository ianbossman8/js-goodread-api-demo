import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import configureStore from 'redux-mock-store'
import { render, screen } from '@testing-library/react'
import { AppWrapper } from '../../util/testUtil'
import { ACTION_CONSTANTS } from '../../actions/authActions'
import Auth from './Auth'

describe('Auth component', () => {
  const store = configureStore()({})

  afterEach(() => {
    store.clearActions()
  })

  const wrappedComponent = (route = '/auth?auth=0') => (
    <AppWrapper store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Auth />
      </MemoryRouter>
    </AppWrapper>
  )

  it('should match snapshot', () => {
    const { container } = render(wrappedComponent())

    expect(container.firstChild).toMatchSnapshot()
  })

  describe('ui display', () => {
    it('should have correct display with auth=0', () => {
      render(wrappedComponent())
      expect(screen.getByRole('link').textContent).toBe('Link to homepage')
      expect(screen.getByText(/not auth/i)).toBeInTheDocument()
    })

    it('should have correct display with auth=1', () => {
      render(wrappedComponent('/auth?auth=1'))
      expect(screen.getByRole('link').textContent).toBe('Link to homepage')
      expect(screen.getByText(/auth/i)).toBeInTheDocument()
    })
  })

  describe('page change', () => {
    let testHistory, testLocation
    render(
      <AppWrapper store={store}>
        <MemoryRouter initialEntries={['/auth?auth=1']}>
          <Auth />
          <Route
            path="*"
            render={({ history, location }) => {
              testHistory = history
              testLocation = location
              return null
            }}
          />
        </MemoryRouter>
      </AppWrapper>
    )

    expect(testLocation.pathname).toBe('/auth')

    act(() => {
      const goHomeLink = document.querySelector('a')
      goHomeLink.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(testLocation.pathname).toBe('/')
  })

  describe('dispatch', () => {
    it('should dispatch action AUTH', () => {
      render(wrappedComponent('/auth?auth=1'))

      expect(store.getActions()[0].type).toBe(ACTION_CONSTANTS.AUTH)
    })
  })
})
