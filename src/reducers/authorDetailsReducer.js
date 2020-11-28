import { ACTION_CONSTANTS } from '../actions/getAuthorDetailsActions'

export const initialState = {
  fetching: false,
  error: '',
  results: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_CONSTANTS.AUTHOR_DETAILS_FETCHING:
      return {
        ...state,
        fetching: true,
        error: '',
      }
    case ACTION_CONSTANTS.AUTHOR_DETAILS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error,
      }
    case ACTION_CONSTANTS.AUTHOR_DETAILS_RECEIVED:
      const { result } = action

      return {
        fetching: false,
        results: {
          name: result.name,
          authorUserId: result?.user?.id,
          fansCount: result.fans_count,
          numberOfFollowers: result.author_followers_count,
          imageUrl: result.image_url,
          authorInfo: result.about,
          hometown: result.hometown,
          authoredBooks: result.books.book || [],
        },
        error: '',
      }
    default:
      return state
  }
}
