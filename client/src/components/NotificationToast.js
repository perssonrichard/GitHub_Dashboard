import React, { useState, useEffect, useContext } from 'react'
import Toast from 'react-bootstrap/Toast'
import GlobalContext from '../context/GlobalContext'

/**
 * Render notifications toasts, i.e cards
 */
const NotificationToast = ({ event, typeofEvent }) => {
  const context = useContext(GlobalContext)

  // Available settings
  const ISSUE = 'issues'
  const RELEASE = 'release'
  const PUSH = 'push'

  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    // Calculate time elapsed since event
    const now = new Date()
    const then = new Date(event.date)

    const diff = now - then
    const minutes = parseInt(diff / 10000)

    setTimeElapsed(minutes)
  }, [event.date])

  const onCloseHandler = () => {
    context.handleOnEvent({})
    context.handleSavedNotifications(context.savedNotifications.filter(n => n.id !== event.id))
  }

  const render = () => {
    switch (typeofEvent) {
      case ISSUE:
        return (
          <Toast onClose={onCloseHandler}>
            <Toast.Header>
              <strong className='mr-auto'>Issue | {event.organization.login}</strong>
              <small>{timeElapsed} mins ago</small>
            </Toast.Header>
            <Toast.Body>Issue <i><a href={event.issue.html_url}>{event.issue.title}</a></i> #{event.issue.number} for repository <a href={event.repository.html_url}>{event.repository.name}</a> was {event.action}.</Toast.Body>
          </Toast>
        )

      case RELEASE:
        return (
          <Toast onClose={onCloseHandler}>
            <Toast.Header>
              <strong className='mr-auto'>Release | {event.organization.login}</strong>
              <small>{timeElapsed} mins ago</small>
            </Toast.Header>
            <Toast.Body>
                Release <a href={event.release.html_url}>{event.release.tag_name}</a> for repository <a href={event.release.html_url}>{event.repository.name}</a> was {event.action}.
            </Toast.Body>
          </Toast>
        )

      case PUSH:
        return (
          <Toast onClose={onCloseHandler}>
            <Toast.Header>
              <strong className='mr-auto'>Push | {event.organization.login}</strong>
              <small>{timeElapsed} mins ago</small>
            </Toast.Header>
            <Toast.Body>Push to <i>{event.ref}</i> in repository <a href={event.repository.html_url}>{event.repository.name}</a> was made by {event.pusher.name}. </Toast.Body>
          </Toast>
        )

      default:
        break
    }
    return ''
  }

  return (
    render()
  )
}

export default NotificationToast
