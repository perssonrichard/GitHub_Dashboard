import { useEffect, useContext } from 'react'
import GlobalContext from '../context/GlobalContext'
import axios from 'axios'
import { setSessionCookie } from '../helpers/session'
import Crypto from 'crypto-js'

/**
 * Authorize user against GitHub. Save authorization token and user ID to cookie
 */
const Callback = ({ history }) => {
  const context = useContext(GlobalContext)

  useEffect(() => {
    if (window.location.search.includes('access_token=')) {
      handleAuthCallback()
    } else {
      history.push('/login')
    }
  })

  /**
   * Called when an access token is in the URL query
   * Ensures the token is valid and saves it encrypted in a session cookie
   */
  const handleAuthCallback = async () => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token')
    const URL = 'https://api.github.com/user'

    try {
      const res = await axios.get(URL, { headers: { Authorization: `token ${token}` } })

      // Validate
      if (res.status === 200) {
        // Encrypt token with a secret key
        const encryptedToken = Crypto.AES.encrypt(token, process.env.REACT_APP_CRYPTO_SECRET).toString()

        setSessionCookie({ token: encryptedToken, userID: res.data.id })
        context.handleLogin()

        // Redirect to /
        history.push('/')
      }
    } catch (err) {
      console.log(err.response)
    }
  }

  // A React component must return something
  return null
}

export default Callback
