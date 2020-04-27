import React, { useContext, useEffect } from 'react'
import GlobalContext from '../context/GlobalContext'
import HandleSettings from './HandleSettings'

/**
 * Render loading repositories
 */
const Repositories = () => {
  const context = useContext(GlobalContext)

  useEffect(() => {
    const fakeLoading = setTimeout(() => {
      context.handleLoadingRepos(false)
    }, 800)

    // Cleanup timeout
    return () => {
      clearTimeout(fakeLoading)
    }
  })

  const renderLoading = () => {
    return (
      <p className='text-center mt-4 textLoadingRepos'>Loading repositories<span>.</span><span>.</span><span>.</span></p>
    )
  }

  const renderContent = () => {
    return (
      <div id='repoDiv'>
        {
          context.repos.length !== 0 &&
            (
              <div className='repoCols'>
                <HandleSettings />
              </div>
            )
        }
      </div>

    )
  }

  return (
    context.loadingRepos
      ? renderLoading()
      : renderContent()
  )
}

export default Repositories
