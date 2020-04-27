import React, { useContext, useEffect } from 'react'
import GlobalContext from '../context/GlobalContext'

/**
 * Render a repository dropdown
 */
const RepoDropdown = () => {
  const context = useContext(GlobalContext)

  useEffect(() => {
    // Set active repo to the firs repo in an organization if org changes
    if (context.repos.length !== 0) {
      context.activeRepo === '' && context.handleActiveRepo(context.repos[0].name)
    }
  }, [context])

  /**
   * Called when a dropdown item is clicked
   */
  const clickHandler = event => {
    context.handleActiveRepo(event.target.textContent)
    context.handleLoadingRepos(true)
  }

  return (
    <>
      <button className='btn dropdown-toggle' type='button' id='repoDropdownButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
        {context.activeRepo}
      </button>
      <div className='dropdown-menu' id='repoDropdown' aria-labelledby='repoDropdownButton'>
        {
          context.repos.map(repo => <button key={repo.id} onClick={clickHandler} className='dropdown-item'>{repo.name}</button>)
        }
      </div>
    </>
  )
}

export default RepoDropdown
