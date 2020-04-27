import React, { useEffect, useContext, useState } from 'react'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Notifications from './components/Notifications'
import * as gh from './helpers/gitHub'
import { getDecryptedToken, getUserID } from './helpers/session'
import GlobalContext from './context/GlobalContext'
import Settings from './components/Settings'
import EmailSettings from './components/EmailSettings'

/**
 * Creates the application
 */
const App = ({ history }) => {
  const context = useContext(GlobalContext)

  const [socket, setSocket] = useState(null)
  let timeout = 250
  const socketURL = 'wss://ao6z251nh5.execute-api.eu-west-1.amazonaws.com/dev'

  useEffect(() => {
    connect()

    // Get and save user to context
    gh.getUser(getDecryptedToken())
      .then(res => {
        // console.log(res)
        context.handleUser(res)
      })
      .catch(err => console.log(err))

    // Get and save organizations to context
    gh.getOrgs(getDecryptedToken())
      .then(res => {
        // Sort by name
        res.sort((a, b) => (a.login > b.login) ? 1 : ((b.login > a.login) ? -1 : 0))

        context.handleOrgs(res)
        context.handleCurrentOrg(res[0])
      })
      .catch(err => console.log(err))
  }, [])

  /**
   * Connect to WebSocket
   */
  const connect = () => {
    const userID = getUserID()
    const WS = new window.WebSocket(`${socketURL}?userID=${userID}`)
    let connectInterval

    /**
     * Event listener on open
     */
    WS.onopen = () => {
      console.log('Connected')

      setSocket(WS)

      // Reset timer on open and clear interval
      timeout = 250
      clearTimeout(connectInterval)
    }

    /**
     * Event listener on close
     */
    WS.onclose = event => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
            10000 / 1000,
            (timeout + timeout) / 1000
        )} second.`,
        event.reason
      )

      // Increment retry interval
      timeout = timeout + timeout
      // Call check after timeout
      connectInterval = setTimeout(check, Math.min(10000, timeout))
    }

    /**
     * Event listener on error
     */
    WS.onerror = err => {
      console.error(
        'Socket encountered error: ',
        err.message,
        'Closing socket'
      )

      WS.close()
    }

    /**
     * Event listener on message.
     * Called when recieving a web hook from server
     */
    WS.onmessage = message => {
      const payload = JSON.parse(message.data)
      context.handleOnEvent(payload)
      context.handleNewEvent(true)
    }
  }

  /**
   * Check if WebSocket connection is closed
   */
  const check = () => {
    // If closed - call connect function
    if (!socket || socket.readyState === window.WebSocket.CLOSED) connect()
  }

  /**
   * Render the main content depending on current view
   */
  const renderContent = () => {
    switch (context.currentView) {
      case context.VIEWS.dashboard:
        return <Dashboard />

      case context.VIEWS.notifications:
        return <Notifications />

      case context.VIEWS.settings:
        return <Settings />

      case context.VIEWS.emailSettings:
        return <EmailSettings />

      default:
        return <Dashboard />
    }
  }

  return (
    <div className='container-fluid h-100'>
      <div className='row h-100'>
        <Sidebar />
        <div className='invisible col-md-2 fixed' />
        <div className='col fluid d-flex flex-column p-0'>
          <Header history={history} />
          <div className='flex-grow'>
            <div className='col-12'>
              <div className='row' id='content'>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
