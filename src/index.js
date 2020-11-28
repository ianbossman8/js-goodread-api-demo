import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import Home from './routes/Home/Home'
import { ACTION_CONSTANTS, getAuthAction } from './actions/authActions'
import ErrorBoundary from './components/ErroBoundary/ErroBoundary'
import reportWebVitals from './reportWebVitals'
import './index.css'

const dispatch = store.dispatch
const Author = React.lazy(() => import('./routes/Author/Author'))
const Auth = React.lazy(() => import('./routes/Auth/Auth'))

async function init() {
  sessionStorage.getItem('isAuth') === 'true'
    ? dispatch(getAuthAction(ACTION_CONSTANTS.AUTH))
    : dispatch(getAuthAction(ACTION_CONSTANTS.NOT_AUTH))

  return ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <React.Suspense fallback={<div />}>
            <ErrorBoundary>
              <Switch>
                <Route exact path={'/'} render={() => <Home />} />
                <Route path={'/page/:p'} render={() => <Home />} />
                <Route path={'/author/:name/:id'} render={() => <Author />} />
                <Route path={'/auth'} render={() => <Auth />} />
              </Switch>
            </ErrorBoundary>
          </React.Suspense>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

init()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
