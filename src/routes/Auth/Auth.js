import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { getAuthAction, ACTION_CONSTANTS } from '../../actions/authActions'

function Auth() {
  const location = useLocation()
  const dispatch = useDispatch()

  const authCode = location.search[location.search.length - 1]

  useEffect(() => {
    if (authCode !== '0') {
      sessionStorage.setItem('isAuth', true)
      dispatch(getAuthAction(ACTION_CONSTANTS.AUTH))
    }
  })

  return (
    <div className="auth-page">
      <p>{authCode === '0' ? 'not auth' : 'auth'}</p>
      <Link to="/">Link to homepage</Link>
    </div>
  )
}

export default Auth
