import React, { useContext, useEffect } from 'react'
import GlobalContext from '../context/GlobalContext'
import App from '../App'
import Login from './Login'
import Callback from './Callback'
import { Router, Route, Switch } from 'react-router-dom'
import { getDecryptedToken } from '../helpers/session'

/**
 * Handle login auth and routes
 */
const AuthWrapper = ({ history }) => {
  const context = useContext(GlobalContext)

  useEffect(() => {
    const token = getDecryptedToken()

    // Set logged in to true if valid cookie exist or push from /login
    if (token || context.isLoggedIn) {
      context.handleLogin()
      history.push('/dashboard')
    } else {
      history.push('/login')
    }
  })

  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/'>
          {
            context.isLoggedIn
              ? <App history={history} />
              : <Login />
          }
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
        <Route exact path='/dashboard'>
          {
            context.isLoggedIn
              ? <App history={history} />
              : <Login />
          }
        </Route>
        <Route exact path='/callback'>
          <Callback history={history} />
        </Route>
      </Switch>
    </Router>
  )
}

export default AuthWrapper
