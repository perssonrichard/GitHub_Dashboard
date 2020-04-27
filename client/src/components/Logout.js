import React, { useContext } from 'react'
import { deleteSessionCookie } from '../helpers/session'
import GlobalContext from '../context/GlobalContext'

/**
 * Render logout button
 */
const Logout = ({ history }) => {
  const context = useContext(GlobalContext)

  const handleClick = () => {
    deleteSessionCookie()
    context.handleLogout()
    history.push('/login')
  }

  return (
    <>
      <button id='logout-button' onClick={handleClick} className='btn btn-block btn-sm btn-social btn-github'>
        <span className='fab fa-github' />Logout
      </button>
    </>
  )
}

export default Logout
