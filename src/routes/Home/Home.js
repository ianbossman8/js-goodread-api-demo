import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
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
  const history = useHistory()
  const params = useParams()
  const queryUrl = useQuery()
  const dispatch = useDispatch()

  const searchResults = useSelector(searchResulsStateSelector)
  const [inputVal, setInput] = useState('')

  const { results, fetching, error } = searchResults
  const { query, work, totalResults } = results
  const queryStr = queryUrl.get('q')

  function handleGetAuthorDetails(authodId) {
    dispatch(getAuthorDetails(authodId))
  }

  function handleSearch(e) {
    setInput(e.target.value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  function handlePageClick(page) {
    let controller = new AbortController()

    dispatch(getSearchResults(queryStr, undefined, page)(controller.signal))

    window.scroll({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    let controller = new AbortController()

    const debouncedSearch = setTimeout(() => {
      if (inputVal) {
        history.push(`/?q=${encodeURI(inputVal)}`)

        return dispatch(getSearchResults(inputVal)(controller.signal))
      }
    }, 500)

    return () => {
      controller.abort()
      clearTimeout(debouncedSearch)
    }
  }, [inputVal, dispatch, history])

  useEffect(() => {
    let controller = new AbortController()

    if (queryStr) {
      if (Object.keys(results).length === 0) {
        dispatch(getSearchResults(queryStr, undefined, parseInt(params.page))(controller.signal))
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
  const numberOfPages = Math.ceil(totalResults / 20)
  const showNumberOfPages = useMemo(() => (numberOfPages > 100 ? 100 : numberOfPages), [numberOfPages])

  return (
    <div className="home-page">
      <form className={`search-form${!isResultEmpty ? ' search-form--top' : ''}`}>
        <label htmlFor="books search">
          <b>start searching here</b>
        </label>
        <br></br>
        <input
          className="main-search__input"
          name="books search"
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
            </p>{' '}
            {/* calculate currenct items */}
            <BookList items={booksList} getAuthorDetails={handleGetAuthorDetails} />
            <Pagination
              handlePageClick={handlePageClick}
              numberOfPages={showNumberOfPages}
              queryStr={queryStr}
              curPage={parseInt(params.page === undefined ? 1 : params.page)}
            />
          </>
        )
      )}
    </div>
  )
}

export default Home
