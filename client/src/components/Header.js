import React from 'react'
import Logout from './Logout'
import Organizations from './Organizations'
import NotificationIcon from './NotificationIcon'

/**
 * Render the header
 */
const Header = ({ history }) => {
  return (
    <nav className='navbar navbar-expand-md fixed-top' id='topNav'>
      <a className='navbar-brand' href='/'>GitHub Dashboard</a>
      <button
        className='navbar-toggler ml-auto py-2'
        type='button'
        data-toggle='collapse'
        data-target='#collapsingNavbar'
      >
        ☰
      </button>
      <div className='collapse navbar-collapse' id='collapsingNavbar'>
        <ul className='nav navbar-nav ml-1'>
          <li className='nav-item'>
            <NotificationIcon />
          </li>
        </ul>
        <ul className='nav navbar-nav ml-auto'>
          <li className='navItem' id='orgText'>Organization</li>
          <li className='navItem'>
            <Organizations />
          </li>
          <li className='navItem mt-auto mb-auto'>
            <Logout history={history} />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header
