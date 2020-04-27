import React, { useContext } from 'react'
import Repositories from './Repositories'
import GlobalContext from '../context/GlobalContext'

/**
 * Render settings
 */
const Settings = () => {
  const context = useContext(GlobalContext)

  return (
    <div className='col'>
      <div className='card' id='settingsCard'>
        <div className='card-header'>
        Organization <span className='currentOrgSpan'>{context.currentOrg.login}</span>
        </div>
        <div className='card-body'>
          <Repositories />
        </div>
      </div>
    </div>
  )
}

export default Settings
