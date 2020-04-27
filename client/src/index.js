import React from 'react'
import ReactDOM from 'react-dom'
import GlobalState from './context/GlobalState'
import AuthWrapper from './components/AuthWrapper'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

/**
 * Starting point of application
 */
ReactDOM.render(
  <GlobalState>
    <AuthWrapper history={history} />
  </GlobalState>, document.getElementById('root'))
