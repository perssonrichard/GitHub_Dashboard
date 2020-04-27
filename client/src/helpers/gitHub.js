
import axios from 'axios'

/**
 * GET a specific user from GitHub
 */
export const getUser = async token => {
  try {
    const URL = 'https://api.github.com/user'
    const res = await axios.get(URL, { headers: { Authorization: `token ${token}` } })

    return res.data
  } catch (err) {
    console.log(err.response)
  }
}

/**
 * GET a specific users organizations
 */
export const getOrgs = async token => {
  try {
    const URL = 'https://api.github.com/user/orgs'
    const res = await axios.get(URL, { headers: { Authorization: `token ${token}` } })

    return res.data
  } catch (err) {
    console.log(err.response)
  }
}
