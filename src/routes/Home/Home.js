import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { searchResultFormatter } from './helpers'
import getSearchResults from '../../actions/searchResultActions'
import getAuthorDetails from '../../actions/getAuthorDetailsActions'
import BookList from '../../components/BookList/BookList'
import Pagination from '../../components/Pagination/Pagination'
import useQuery from '../../customHooks/queryHooks'
import './home.css'

function searchResulsStateSelector(state) {
  return state.searchResults
}

function Home() {
  const location = useLocation()
  const history = useHistory()
  const params = useParams()
  const queryUrl = useQuery()
  const dispatch = useDispatch()

  const searchResults = useSelector(searchResulsStateSelector)
  const [inputVal, setInput] = useState('')

  const { results, fetching, error } = searchResults
  const { query, work, totalResults } = results
  const queryParam = 'q'
  const queryStr = queryUrl.get(queryParam)

  function handleGetAuthorDetails(authodId) {
    dispatch(getAuthorDetails(authodId))
  }

  function handleSearch(e) {
    setInput(e.target.value)
  }

  function handleKeyDown(e) {
    // when enter key is received we can ignore it
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  function handlePageClick(page) {
    let controller = new AbortController()

    dispatch(getSearchResults(queryStr, undefined, page)(controller.signal))

    // scroll back to top when page link at the bottom is clicked
    window.scroll({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const waitTimeAfterType = 500

    let controller = new AbortController()

    const debouncedSearch = setTimeout(() => {
      if (inputVal) {
        history.push(`/?${queryParam}=${encodeURI(inputVal)}`)

        return dispatch(getSearchResults(inputVal)(controller.signal))
      }
    }, waitTimeAfterType)

    return () => {
      controller.abort()
      clearTimeout(debouncedSearch)
    }
  }, [inputVal, dispatch, history])

  useEffect(() => {
    // fetch again when refresh
    let controller = new AbortController()

    if (queryStr) {
      if (Object.keys(results).length === 0) {
        dispatch(getSearchResults(queryStr, undefined, parseInt(params.p))(controller.signal))
      }
    } else {
      history.push('/')
    }

    return () => {
      controller.abort()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const booksList = useMemo(() => searchResultFormatter(work), [work])
  const isResultEmpty = useMemo(() => Object.keys(results).length === 0, [results])

  const numOfResultsFromApi = 20
  const numberOfPages = Math.ceil(totalResults / numOfResultsFromApi)

  const maxPage = 100
  const showNumberOfPages = useMemo(() => (numberOfPages > maxPage ? maxPage : numberOfPages), [numberOfPages])

  return (
    <div className="home-page">
      <form className={`search-form${!isResultEmpty ? ' search-form--top' : ''}`}>
        <label htmlFor="books-search">
          <b>start searching here</b>
        </label>
        <br></br>
        <input
          className="main-search__input"
          name="books-search"
          onKeyDown={handleKeyDown}
          onChange={handleSearch}
          value={inputVal}
          placeholder="search for your favourite books..."
        />
      </form>

      <p className="search-status">
        <span>{fetching ? 'fetching for- ' : !isResultEmpty && 'search results for- '}</span>
        <span>{fetching ? inputVal || queryStr : !isResultEmpty && query}</span>
      </p>

      {error ? (
        <h1>{error}</h1>
      ) : (
        !isResultEmpty && (
          <>
            <p className="search-status">
              <span>numer of results: {totalResults}</span>
            </p>
            <BookList items={booksList} getAuthorDetails={handleGetAuthorDetails} location={location} />
            <Pagination
              handlePageClick={handlePageClick}
              numberOfPages={showNumberOfPages}
              queryStr={queryStr}
              curPage={parseInt(params.p === undefined ? 1 : params.p)}
            />
          </>
        )
      )}
    </div>
  )
}

export default Home
