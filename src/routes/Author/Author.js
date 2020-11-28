import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams, useLocation } from 'react-router-dom'
import DetailedBookList from '../../components/DetailedBookList/DetailedBookList'
import getAuthorDetails from '../../actions/getAuthorDetailsActions'
import { api } from '../../constant'
import './author.css'

function authorDetailsStateSelector(state) {
  return state.authorDetails
}

function authorFollowersStateSelector(state) {
  return state.authorFollowers
}

function authStateSelector(state) {
  return state.auth
}

function followersRender(err, fetching, res, auth) {
  if (auth) {
    if (err) {
      return <p>{err}</p>
    }

    if (fetching) {
      return <p>fething followers</p>
    }

    if (res.length > 0) {
      return (
        <ul className="followers-detail-list">
          {res.map((follower) => (
            <li key={follower.id} className="followers-detail">
              <img src={follower.image_url} alt={follower.name} />
            </li>
          ))}
        </ul>
      )
    }

    return <p>no followers</p>
  }

  return <a href={`${api.netlify}/.netlify/functions/auth`}>login to see author followers</a>
}

function Author() {
  const location = useLocation()
  const { name, id } = useParams()
  const dispatch = useDispatch()

  const { error: errorAuthor, fetching: fetchingAuthor, results: authorInfo } = useSelector(authorDetailsStateSelector)
  const { isAuth } = useSelector(authStateSelector)
  const { error: followersError, fetching: fetchingfollowers, results: followersResult } = useSelector(
    authorFollowersStateSelector
  )

  useEffect(() => {
    // fetch again when refresh
    let controller = new AbortController()

    if (Object.keys(authorInfo).length === 0) {
      dispatch(getAuthorDetails(id))
    }

    return () => {
      controller.abort()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="author-page">
      {fetchingAuthor ? (
        <p>fetching details of {name}</p>
      ) : errorAuthor ? (
        <h1>{errorAuthor}</h1>
      ) : (
        <>
          <div>
            <Link to={location.state?.from ?? '/'}>Back</Link>
            <img className="author-photo" src={authorInfo.imageUrl} alt={`${authorInfo.name}`} />
            <b>home town- {authorInfo.hometown}</b>
            <b>fans count- {authorInfo.fansCount}</b>
            <b>number of followers- {authorInfo.numberOfFollowers}</b>
            {followersRender(followersError, fetchingfollowers, followersResult, isAuth)}
          </div>

          <div className="author-page__author-info">
            <h1>{authorInfo.name}</h1>
            <p dangerouslySetInnerHTML={{ __html: authorInfo.authorInfo }} />
            <div className="author-page__books-list">
              <p>
                <b>more work from {authorInfo.name}</b>
              </p>
              {authorInfo.authoredBooks && <DetailedBookList books={authorInfo.authoredBooks} />}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Author
