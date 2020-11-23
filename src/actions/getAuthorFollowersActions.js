export const ACTION_CONSTANTS = {
  AUTHOR_FOLLOWERS_FETCHING: 'AUTHOR_FOLLOWERS_FETCHING',
  AUTHOR_FOLLOWERS_RECEIVED: 'AUTHOR_FOLLOWERS_RECEIVED',
  AUTHOR_FOLLOWERS_ERROR: 'AUTHOR_FOLLOWERS_ERROR',
}

export const actions = {
  receivedAuthorFollowers: function (result) {
    return {
      type: ACTION_CONSTANTS.AUTHOR_FOLLOWERS_RECEIVED,
      result,
    }
  },
  fetchingAuthorFollowers: function () {
    return {
      type: ACTION_CONSTANTS.AUTHOR_FOLLOWERS_FETCHING,
    }
  },
  errorAuthorFollowers: function (error) {
    return {
      type: ACTION_CONSTANTS.AUTHOR_FOLLOWERS_ERROR,
      error,
    }
  },
}

export default function getAuthorFollowers(authorUserId, page = 1) {
  return async (dispatch, _, { netlifyEndpoint }) => {
    try {
      dispatch(actions.fetchingAuthorFollowers())

      const authorFollowersUrl = new URL(`/author-followers/${authorUserId}`, netlifyEndpoint)
      const params = {
        page,
      }
      authorFollowersUrl.search = new URLSearchParams(params)

      const response = await fetch(authorFollowersUrl, {
        method: 'GET',
        Accept: 'application/json',
        credentials: 'include',
      })

      if (response.ok) {
        const parsedRes = await response.json()

        return dispatch(actions.receivedAuthorFollowers(parsedRes.GoodreadsResponse.followers.user))
      }

      throw new Error('api error')
    } catch (error) {
      actions.errorAuthorFollowers(error.message)
    }
  }
}
