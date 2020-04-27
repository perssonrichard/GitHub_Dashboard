import React, { useContext, useEffect } from 'react'
import GlobalContext from '../context/GlobalContext'
import NotificationToast from './NotificationToast'

/**
 * Render notifications
 */
const Notifications = () => {
  const context = useContext(GlobalContext)

  useEffect(() => {
    const event = context.onEvent

    // Prevent event from being added twice
    if (Object.keys(event).length !== 0) {
      const find = context.savedNotifications.find(s => s.id === event.id)
      if (find === undefined) {
        context.handleSavedNotifications(([...context.savedNotifications, event]))
      }
    }
  })

  const showEvent = () => {
    return context.savedNotifications.map(n => {
      return (
        <NotificationToast event={n} typeofEvent={n.event} id={n.id} key={n.id} />
      )
    })
  }

  return (
    <div className='col'>
      <div className='card cards' id='settingsCard'>
        <div className='card-header'>
      Notifications
        </div>
        <div className='card-body'>
          {
            context.savedNotifications.length
              ? showEvent()
              : 'No new notifications'
          }
        </div>
      </div>
    </div>
  )
}

export default Notifications
