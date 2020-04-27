import * as Cookies from 'js-cookie'
import crypto from 'crypto-js'

const SESSION = 'session'

/**
 * Set a session cookie which expires in one hour
 */
export const setSessionCookie = session => {
  const oneHour = new Date(new Date().getTime() + 60 * 60 * 1000)
  Cookies.remove(SESSION)
  Cookies.set(SESSION, session, { expires: oneHour })
}

/**
 * Get session cookie or an empty object if no cookie exist
 */
export const getSessionCookie = () => {
  const cookie = Cookies.get(SESSION)

  if (cookie === undefined) {
    return {}
  } else {
    return JSON.parse(cookie)
  }
}

export const deleteSessionCookie = () => {
  Cookies.remove(SESSION)
}

/**
 * Decrypt a token from session cookie
 */
export const getDecryptedToken = () => {
  const cookie = getSessionCookie()
  const token = cookie.token

  if (token !== undefined) {
    const token = cookie.token

    const bytes = crypto.AES.decrypt(token, process.env.REACT_APP_CRYPTO_SECRET)
    const decryptedToken = bytes.toString(crypto.enc.Utf8)

    return decryptedToken
  }
}

/**
 * Get userID from session cookie
 */
export const getUserID = () => {
  const cookie = getSessionCookie()
  return cookie.userID
}
