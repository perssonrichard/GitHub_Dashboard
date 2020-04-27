import React, { useContext } from 'react'
import Statistics from './Statistics'
import GlobalContext from '../context/GlobalContext'
import RepoDropdown from './RepoDropdown'

/**
 * Render the dashboard
 */
const Dashboard = () => {
  const context = useContext(GlobalContext)

  return (
    <div className='col'>
      <div className='card cards'>
        <div className='card-header'>
        Organization <span className='currentOrgSpan'>{context.currentOrg.login}</span>
          <div className='float-right'>Repository <RepoDropdown /></div>
        </div>
        <div className='card-body'>
          <Statistics />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
