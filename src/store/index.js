import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import reducers from './rootReducer'
import { api } from '../constant'

export const appApi = {
  netlifyEndpoint: api.netlify,
}

export default createStore(reducers, applyMiddleware(thunk.withExtraArgument(appApi)))
