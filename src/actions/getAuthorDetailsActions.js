import getAuthorFollowers from './getAuthorFollowersActions'

export const ACTION_CONSTANTS = {
  AUTHOR_DETAILS_FETCHING: 'AUTHOR_DETAILS_FETCHING',
  AUTHOR_DETAILS_RECEIVED: 'AUTHOR_DETAILS_RECEIVED',
  AUTHOR_DETAILS_ERROR: 'AUTHOR_DETAILS_ERROR',
}

export const actions = {
  receivedAuthorDetails: function (result) {
    return {
      type: ACTION_CONSTANTS.AUTHOR_DETAILS_RECEIVED,
      result,
    }
  },
  fetchingAuthorDetails: function () {
    return {
      type: ACTION_CONSTANTS.AUTHOR_DETAILS_FETCHING,
    }
  },
  errorAuthorDetails: function (error) {
    return {
      type: ACTION_CONSTANTS.AUTHOR_DETAILS_ERROR,
      error,
    }
  },
}

export default function getAuthorDetails(authodId) {
  return async (dispatch, getState, { netlifyEndpoint }) => {
    try {
      dispatch(actions.fetchingAuthorDetails())

      const authorDetailUrl = new URL(`/author/${authodId}`, netlifyEndpoint)

      const response = await fetch(authorDetailUrl)

      if (response.ok) {
        const parsedRes = await response.json()

        if (getState().auth.isAuth && typeof parsedRes.GoodreadsResponse.author.user !== 'undefined') {
          dispatch(getAuthorFollowers(parsedRes.GoodreadsResponse.author.user.id))
        }

        return dispatch(actions.receivedAuthorDetails(parsedRes.GoodreadsResponse.author))
      }
      throw new Error('api error')
    } catch (error) {
      actions.errorAuthorDetails(error.message)
    }
  }
}
