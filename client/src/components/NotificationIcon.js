import React, { useContext } from 'react'
import GlobalContext from '../context/GlobalContext'

/**
 * Render notification icon in the header
 */
const NotificationIcon = () => {
  const context = useContext(GlobalContext)

  const clickHandler = () => {
    context.handleNewEvent(false)
    context.handleCurrentView(context.VIEWS.notifications)
  }

  return (
    <i id='notification' className='fas fa-comments mr-sm-3' onClick={clickHandler}>
      {
        context.newEvent === true && <span className='badge badge-danger pulsate-fwd' id='newNotification'>New</span>
      }
    </i>
  )
}

export default NotificationIcon
