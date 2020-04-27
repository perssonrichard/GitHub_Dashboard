import React, { useContext, useEffect } from 'react'
import GlobalContext from '../context/GlobalContext'
import axios from 'axios'
import { getDecryptedToken } from '../helpers/session'

/**
 * Render organization dropdown
 */
const Organizations = () => {
  const context = useContext(GlobalContext)
  const ref = React.createRef()

  useEffect(() => {
    const orgName = context.currentOrg.login
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const URL = `https://api.github.com/orgs/${orgName}/repos?sort=updated`

    if (orgName !== undefined && orgName !== '') {
      // Get all repos for organization
      axios.get(URL, {
        headers: { Authorization: `token ${getDecryptedToken()}` },
        cancelToken: source.token
      })
        .then(res => {
          // Sort by name and admin status
          res.data.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
          res.data.sort((a, b) => (a.permissions.admin === b.permissions.admin) ? 0 : a.permissions.admin ? -1 : 1)
          context.handleRepos(res.data)
          context.handleActiveRepo(res.data[0].name)
        })
        .catch(err => {
          if (!axios.isCancel(err)) {
            console.log(err)
          }
        })
    }

    // Cleanup axios request
    return () => {
      source.cancel()
    }
  }, [context.currentOrg.login])

  /**
   * Called when a dropdown item is clicked
   */
  const clickHandler = event => {
    const target = event.target.textContent
    ref.current.textContent = target

    // Create and add span element to target to have it focused in dropdown
    const span = document.createElement('span')
    span.setAttribute('class', 'caret')
    ref.current.appendChild(span)

    // Set target to current organization
    context.orgs.forEach((i) => {
      if (i.login === target) {
        context.handleCurrentOrg(i)
        context.handleLoadingRepos(true)
      }
    })
  }

  const renderDropdown = () => {
    return (
      <ul className='nav nav-pills ml-2 mr-3' role='tablist'>
        <li role='presentation' className='dropdown'>
          <button className='dropdown-toggle btn btn-sm' id='orgDropdown' ref={ref} data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
            {context.currentOrg.login}
            <span className='caret' />
          </button>

          <ul className='dropdown-menu' id='menu1' onClick={clickHandler} aria-labelledby='orgDropdown'>
            {
              context.orgs.map(org => <li key={org.id} className='dropdown-item organizationOption'>{org.login}</li>)
            }
          </ul>
        </li>
      </ul>
    )
  }

  return (
    <>
      {
        context.orgs && context.currentOrg
          ? renderDropdown()
          : ''
      }
    </>
  )
}

export default Organizations
