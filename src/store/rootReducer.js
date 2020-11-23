import { combineReducers } from 'redux'
import searchResults from '../reducers/searchResultsReducer'
import authorDetails from '../reducers/authorDetailsReducer'
import authorFollowers from '../reducers/authorFollowersReducer'
import auth from '../reducers/authReducer'

export default combineReducers({ searchResults, authorDetails, authorFollowers, auth })
