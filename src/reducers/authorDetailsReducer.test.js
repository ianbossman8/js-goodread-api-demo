import reducer, { initialState } from './authorDetailsReducer'
import { actions } from '../actions/getAuthorDetailsActions'

describe('author details reducer', () => {
  it('should retturn inital state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle AUTHOR_DETAILS_FETCHING', () => {
    expect(reducer(initialState, actions.fetchingAuthorDetails())).toEqual({
      ...initialState,
      fetching: true,
      error: '',
    })
  })

  it('should handle AUTHOR_DETAILS_ERROR', () => {
    expect(reducer(initialState, actions.errorAuthorDetails('error'))).toEqual({
      ...initialState,
      error: 'error',
      fetching: false,
    })
  })

  it('should handle AUTHOR_DETAILS_RECEIVED', () => {
    let result = {
      name: 'joe',
      user: {
        id: 1,
      },
      fans_count: 1,
      author_followers_count: 1,
      image_url: 'someurl',
      about: 'about',
      hometown: 'london',
      books: {
        book: ['1 book'],
      },
    }

    expect(reducer(initialState, actions.receivedAuthorDetails(result))).toEqual({
      ...initialState,
      fetching: false,
      results: {
        name: result.name,
        authorUserId: result.user.id,
        fansCount: result.fans_count,
        numberOfFollowers: result.author_followers_count,
        imageUrl: result.image_url,
        authorInfo: result.about,
        hometown: result.hometown,
        authoredBooks: result.books.book,
      },
      error: '',
    })

    result = {
      ...result,
      user: {},
      books: {},
    }

    expect(reducer(initialState, actions.receivedAuthorDetails(result))).toEqual({
      ...initialState,
      fetching: false,
      results: {
        name: result.name,
        authorUserId: undefined,
        fansCount: result.fans_count,
        numberOfFollowers: result.author_followers_count,
        imageUrl: result.image_url,
        authorInfo: result.about,
        hometown: result.hometown,
        authoredBooks: [],
      },
      error: '',
    })
  })
})
