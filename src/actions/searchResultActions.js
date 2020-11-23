export const ACTION_CONSTANTS = {
  SEARCH_RESULT_FETCHING: 'SEARCH_RESULT_FETCHING',
  SEARCH_RESULT_RECEIVED: 'SEARCH_RESULT_RECEIVED',
  SEARCH_RESULT_ERROR: 'SEARCH_RESULT_ERROR',
}

export const actions = {
  receivedSearchResults: function (result) {
    return {
      type: ACTION_CONSTANTS.SEARCH_RESULT_RECEIVED,
      result,
    }
  },
  fetchingSearchResult: function () {
    return {
      type: ACTION_CONSTANTS.SEARCH_RESULT_FETCHING,
    }
  },
  errorSearchResult: function (error) {
    return {
      type: ACTION_CONSTANTS.SEARCH_RESULT_ERROR,
      error,
    }
  },
}

export default function getSearchResults(query, search = 'all', page = 1) {
  return function (signal) {
    return async (dispatch, _, { netlifyEndpoint }) => {
      try {
        dispatch(actions.fetchingSearchResult())

        const goodreadSearchUrl = new URL('/search', netlifyEndpoint)
        const params = {
          q: query,
          page,
          search,
        }

        goodreadSearchUrl.search = new URLSearchParams(params)

        const response = await fetch(goodreadSearchUrl, { signal })

        if (response.ok) {
          const parsedRes = await response.json()

          return dispatch(actions.receivedSearchResults(parsedRes.GoodreadsResponse.search))
        }

        throw new Error('api error')
      } catch (error) {
        actions.errorSearchResult(error.message)
      }
    }
  }
}
