import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './pagination.css'

function PageLink(props) {
  return (
    <li className={props.isSelected ? 'page-num--selected' : ''}>
      <Link
        to={`/page/${props.value}?q=${props.queryStr}`}
        onClick={(e) => props.handleClick(e, props.value)}
        id={props.page}
      >
        {props.value}
      </Link>
    </li>
  )
}

function Pagination(props) {
  const initialState = [2, 3, 4]
  const [pageLinkState, setPageLinkState] = useState(initialState)
  const { numberOfPages, queryStr, curPage } = props

  function handleClick(e, value) {
    props.handlePageClick(value)

    // when the last number of the triple is clicked
    if (parseInt(e.target.id) === pageLinkState.length && pageLinkState[pageLinkState.length - 1] < numberOfPages - 1) {
      setPageLinkState((prevPageLinkState) =>
        prevPageLinkState.reduce((newArr, curPageVal) => (newArr = [...newArr, ++curPageVal]), [])
      )
    }

    // when the first number of the triple is clicked
    if (parseInt(e.target.id) === 1 && pageLinkState[0] > 2) {
      setPageLinkState((prevPageLinkState) =>
        prevPageLinkState.reduce((newArr, curPageVal) => (newArr = [...newArr, --curPageVal]), [])
      )
    }

    // when the last number of the pagination is clicked
    if (parseInt(e.target.id) === numberOfPages - 1) {
      let n = numberOfPages
      setPageLinkState((prevPageLinkState) =>
        prevPageLinkState.reduce((newArr) => (newArr = [...newArr, --n]), []).reverse()
      )
    }

    // when the first number of the pagination is clicked
    if (parseInt(e.target.id) === 0) {
      setPageLinkState(initialState)
    }
  }

  return (
    <ol className="pagination">
      {/* if number of pages are less than or equal to 4 always display all*/}
      {numberOfPages <= 4 ? (
        [...Array(numberOfPages)].map((_, page) => (
          <PageLink
            key={page}
            page={page}
            value={page + 1}
            queryStr={queryStr}
            handleClick={handleClick}
            isSelected={curPage === page}
          />
        ))
      ) : (
        // awalys show first and last page number
        <>
          <PageLink
            key={0}
            page={0}
            value={1}
            queryStr={queryStr}
            handleClick={handleClick}
            isSelected={curPage === 1}
          />
          {pageLinkState[0] !== 2 && <span>...</span>}
          {[...Array(3)].map((_, page) => (
            <PageLink
              key={page + 1}
              page={page + 1}
              value={pageLinkState[page]}
              queryStr={queryStr}
              handleClick={handleClick}
              isSelected={curPage === pageLinkState[page]}
            />
          ))}
          {pageLinkState[pageLinkState.length - 1] + 1 !== numberOfPages && <span>...</span>}
          <PageLink
            key={numberOfPages - 1}
            page={numberOfPages - 1}
            value={numberOfPages}
            queryStr={queryStr}
            handleClick={handleClick}
            isSelected={curPage === numberOfPages}
          />
        </>
      )}
    </ol>
  )
}

export default Pagination
