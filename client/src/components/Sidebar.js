import React, { useContext } from 'react'
import GlobalContext from '../context/GlobalContext'

/**
 * Render sidebar
 */
const Sidebar = () => {
  const context = useContext(GlobalContext)
  const { dashboard, settings, notifications, emailSettings } = context.VIEWS

  const clickHandlerDashboard = () => {
    context.handleCurrentView(dashboard)
  }

  const clickHandlerSettings = () => {
    context.handleLoadingRepos(true)
    context.handleCurrentView(settings)
  }

  const clickHandlerNotifications = () => {
    context.handleCurrentView(notifications)
  }

  const clickHandlerEmailSettings = () => {
    context.handleCurrentView(emailSettings)
  }

  return (
    <div className='col-md-2 fixed pl-0 py-2 left' id='sidebar'>
      <div id='imgContainer' className='text-center'>
        {
          <>
            <img className='img-fluid' id='avatar' src={context.user.avatar_url} alt='User avatar' />
            <p id='username'>{context.user.login}</p>
          </>
        }
      </div>
      <ul className='nav flex-md-column flex-nowrap justify-content-center'>
        <li className='nav-item'>
          <button className='btn' onClick={clickHandlerDashboard}>
            <i className='zmdi zmdi-view-dashboard' />Dashboard
          </button>
        </li>
        <li className='nav-item'>
          <button className='btn' onClick={clickHandlerNotifications}>
            <i className='zmdi zmdi-notifications' />Notifications
          </button>
        </li>
        <li className='nav-item'>
          <button className='btn' onClick={clickHandlerSettings}>
            <i className='zmdi zmdi-settings' />Settings
          </button>
        </li>
        <li className='nav-item'>
          <button className='btn' onClick={clickHandlerEmailSettings}>
            <i className='zmdi zmdi-email' />Email Settings
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
