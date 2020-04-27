import React, { useContext } from 'react'
import GlobalContext from '../context/GlobalContext'

const authURL = `https://github.com//login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=user,repo,admin:org_hook,admin:repo_hook`

/**
 * Render login button
 */
const Login = () => {
  const context = useContext(GlobalContext)

  const handleClick = () => {
    context.handleLoggingIn(true)
  }

  return (
    <div className='container mt-5' style={{ maxWidth: '200px' }}>
      <a href={authURL} onClick={handleClick} id='github-button' className='btn btn-block btn-sm btn-social btn-github'>
        <span className='fab fa-github' /> Sign in with GitHub
      </a>
    </div>
  )
}

export default Login
