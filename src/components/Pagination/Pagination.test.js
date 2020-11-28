import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import configureStore from 'redux-mock-store'
import { render, screen } from '@testing-library/react'
import { AppWrapper } from '../../util/testUtil'
import Pagination from './Pagination'

describe('Auth component', () => {
  const store = configureStore()({})

  afterEach(() => {
    store.clearActions()
  })

  const wrappedComponent = (route = '/?q=query', props) => {
    return (
      <AppWrapper store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Pagination {...props} />
        </MemoryRouter>
      </AppWrapper>
    )
  }

  const numberOfPages = 7
  const queryStr = 'query'
  const curPage = 1
  const handlePageClick = jest.fn()

  let initProps = {
    numberOfPages,
    queryStr,
    curPage,
    handlePageClick,
  }

  describe('ui display', () => {
    it('should consist of 5 pages and 1 ...', () => {
      let props = {
        ...initProps,
      }
      render(wrappedComponent(undefined, props))
      expect(screen.getAllByRole('link').length).toBe(5)
      expect(screen.getAllByText('...').length).toBe(1)
    })
  })

  describe('page number clicking', () => {
    describe('click last of triple', () => {
      it('should have only 1 ... and change the numbers from 2 3 4 to 3 4 5', () => {
        render(wrappedComponent(undefined, initProps))
        userEvent.click(screen.getAllByRole('link')[3])
        const links = screen.getAllByRole('link')
        const firstOfTriple = links[1].textContent
        const secondOfTriple = links[2].textContent
        const thirdOfTriple = links[3].textContent

        expect(firstOfTriple).toBe('3')
        expect(secondOfTriple).toBe('4')
        expect(thirdOfTriple).toBe('5')
        expect(screen.getAllByText('...').length).toBe(2)
      })
    })

    describe('click last num', () => {
      it('should have only 1 ... and change the numbers from 2 3 4 to 4 5 6', () => {
        render(wrappedComponent(undefined, initProps))

        userEvent.click(screen.getAllByRole('link')[screen.getAllByRole('link').length - 1])
        const links = screen.getAllByRole('link')
        const firstOfTriple = links[1].textContent
        const secondOfTriple = links[2].textContent
        const thirdOfTriple = links[3].textContent

        expect(firstOfTriple).toBe('4')
        expect(secondOfTriple).toBe('5')
        expect(thirdOfTriple).toBe('6')
        expect(screen.getAllByText('...').length).toBe(1)
      })
    })

    describe('click first num', () => {
      it('should have only 1 ... and change the numbers from 4 5 6 to 2 3 4', () => {
        render(wrappedComponent(undefined, initProps))

        userEvent.click(screen.getAllByRole('link')[screen.getAllByRole('link').length - 1])
        userEvent.click(screen.getAllByRole('link')[0])
        const links = screen.getAllByRole('link')
        const firstOfTriple = links[1].textContent
        const secondOfTriple = links[2].textContent
        const thirdOfTriple = links[3].textContent

        expect(firstOfTriple).toBe('2')
        expect(secondOfTriple).toBe('3')
        expect(thirdOfTriple).toBe('4')
        expect(screen.getAllByText('...').length).toBe(1)
      })
    })

    describe('click first of the triple', () => {
      it('should have only 1 ... and change the numbers from 4 5 6 to 2 3 4', () => {
        render(wrappedComponent(undefined, initProps))

        userEvent.click(screen.getAllByRole('link')[3])
        userEvent.click(screen.getAllByRole('link')[1])
        const links = screen.getAllByRole('link')
        const firstOfTriple = links[1].textContent
        const secondOfTriple = links[2].textContent
        const thirdOfTriple = links[3].textContent

        expect(firstOfTriple).toBe('2')
        expect(secondOfTriple).toBe('3')
        expect(thirdOfTriple).toBe('4')
        expect(screen.getAllByText('...').length).toBe(1)
      })
    })
  })
})
