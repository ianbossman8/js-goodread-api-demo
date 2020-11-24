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
const initialState = [2, 3, 4]
function Pagination(props) {
  const { numberOfPages, queryStr, curPage } = props

  const [pageLinkState, setPageLinkState] = useState(initialState)

  function handleClick(e, value) {
    props.handlePageClick(value)

    if (parseInt(e.target.id) === pageLinkState.length && pageLinkState[pageLinkState.length - 1] < numberOfPages - 1) {
      setPageLinkState((prevPageLinkState) =>
        prevPageLinkState.reduce((newArr, curPageVal) => (newArr = [...newArr, ++curPageVal]), [])
      )
    }

    if (parseInt(e.target.id) === 1 && pageLinkState[0] > 2) {
      setPageLinkState((prevPageLinkState) =>
        prevPageLinkState.reduce((newArr, curPageVal) => (newArr = [...newArr, --curPageVal]), [])
      )
    }

    if (parseInt(e.target.id) === numberOfPages) {
      let n = numberOfPages
      setPageLinkState((prevPageLinkState) =>
        prevPageLinkState.reduce((newArr) => (newArr = [...newArr, --n]), []).reverse()
      )
    }

    if (parseInt(e.target.id) === 0) {
      setPageLinkState(initialState)
    }
  }

  return (
    <ol className="pagination">
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
            key={numberOfPages}
            page={numberOfPages}
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
