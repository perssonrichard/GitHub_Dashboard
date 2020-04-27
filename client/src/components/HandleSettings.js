import React, { useState, useEffect, useContext } from 'react'
import Pagination from './Pagination'
import GlobalContext from '../context/GlobalContext'
import { getUserID } from '../helpers/session'
import axios from 'axios'
import crypto from 'crypto-js'

/**
 * Handle user settings. Shows all repos with available settings
 */
const HandleSettings = () => {
  const context = useContext(GlobalContext)
  const repos = context.repos

  // Available setting types
  const ISSUE = 'issues'
  const RELEASE = 'release'
  const PUSH = 'push'
  const OPTIONS = [ISSUE, RELEASE, PUSH]

  // Initially set all options to false
  const [settings, setSettings] = useState(
    OPTIONS.reduce((options, option) => ({
      ...options,
      [option]: false
    }), {})
  )

  // Paginate repos
  const [currentPage, setCurrentPage] = useState(1)
  const [reposPerPage] = useState(5)

  const [showSaveButton, setShowSaveButton] = useState(false)

  useEffect(() => {
    const secret = process.env.REACT_APP_HOOK_SECRET
    const encryptedSecret = crypto.AES.encrypt(secret, process.env.REACT_APP_CRYPTO_SECRET).toString()
    const userID = getUserID()
    const URL = `https://github-server.perssonrichard.org/settings?userID=${userID}`
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    // Get user settings
    axios({
      cancelToken: source.token,
      method: 'get',
      url: URL,
      headers: {
        Authorization: encryptedSecret
      }
    })
      .then(res => {
        // If settings exist
        if (Object.keys(res.data.settings).length) {
          const userSettings = res.data.settings.settings
          const savedSettings = JSON.parse(userSettings)

          savedSettings.forEach(i => {
            i.setting.forEach(s => {
              const obj = { repoID: i.repoID, setting: s }

              // Set current settings to their saved status
              setSettings(set =>
                ({ ...set, [JSON.stringify(obj)]: true })
              )
            })
          })
        }
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log('Request canceled: ' + err.message)
        } else {
          console.log(err)
        }
      })

    // Cleanup axios request
    return () => {
      return source.cancel()
    }
  }, [])

  // Paginate: Get current repos
  const indexOfLastRepo = currentPage * reposPerPage
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage
  const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  /**
   * Called when settings button is toggled
   */
  const handleChange = event => {
    setShowSaveButton(true)

    const { id } = event.target

    setSettings(prevState => (
      {
        ...prevState,
        [id]: !prevState[id]
      }
    ))
  }

  /**
   * Called when the save button is clicked
   */
  const handleSave = () => {
    context.handleSavingSettingsLoading(true)

    const userID = getUserID()
    let settingsToSave = []

    Object.keys(settings)
      .filter(setting => settings[setting])
      .forEach(setting => {
        const parsed = JSON.parse(setting)
        settingsToSave.push(parsed)
      })

    // Merge repos and make setting to an array rather than string
    // {setting: ["Releases", "Issues"]} instead of {setting: 'Releases'}, {setting: 'Issues'}
    const seen = new Map()

    settingsToSave = settingsToSave.filter(entry => {
      let previous

      // If repo.id is seen before
      if (Object.prototype.hasOwnProperty.call(seen, entry.repoID)) {
        previous = seen[entry.repoID]
        previous.setting.push(entry.setting)

        return false
      }

      // If the entry is not an array - make it one
      if (!Array.isArray(entry.setting)) {
        entry.setting = [entry.setting]
      }

      // Remember the repo was seen
      seen[entry.repoID] = entry

      return true
    })

    let hooks = [...settingsToSave]

    hooks = hooks.map((i) => {
      const obj = Object.assign({}, i)
      const repo = repos.find(r => r.id === i.repoID)
      obj.repo = repo

      return obj
    })

    // Save hooks and user settings
    context.handleHooks(hooks)
    context.saveUserSettings(userID, settingsToSave)
  }

  const savingAlert = () => {
    return (
      <div className='alert alert-secondary text-center mt-3' id='textLoadingSaving' role='alert'>
          Saving<span>.</span><span>.</span><span>.</span>
      </div>
    )
  }

  const successfulSaveAlert = () => {
    return (
      <div className='alert alert-success text-center mt-3 fade-in' id='successfulSaveAlert' role='alert'>
      Settings saved!
      </div>
    )
  }

  const unSuccessfulSaveAlert = () => {
    return (
      <div className='alert alert-danger text-center mt-3 fade-in' id='unSuccessfulSaveAlert' role='alert'>
      Something went wrong :(
      </div>
    )
  }

  return (
    <>
      <p>Select repositories you would like to get notifications on.</p>
      {
        context.savingSettingsLoading && savingAlert()
      }
      {
        context.successfulSave && successfulSaveAlert()
      }
      {
        context.couldNotSave && unSuccessfulSaveAlert()
      }

      <table className='table table-dark'>
        <thead>
          <tr>
            <th scope='col' style={{ width: '30%' }}>Repository</th>
            <th scope='col' style={{ width: '40%' }}>Description</th>
            <th scope='col' style={{ width: '10%' }}>Issues</th>
            <th scope='col' style={{ width: '10%' }}>Releases</th>
            <th scope='col' style={{ width: '10%' }}>Pushes</th>
          </tr>
        </thead>
        <tbody>
          {
            // Render current repos
            currentRepos.map(repo => (
              <tr key={repo.id}>
                <td>
                  <a href={repo.html_url} rel='noopener noreferrer' target='_blank'>{repo.name}</a>
                </td>
                <td>
                  {repo.description || 'No description'}
                </td>
                {
                // Render available options
                  repo.permissions.admin
                    ? OPTIONS.map((option, i) =>
                      <td key={i}>
                        <div className='settings' style={{ marginTop: '-20px' }}>
                          <input onChange={handleChange} checked={!!settings[JSON.stringify({ repoID: repo.id, setting: option })]} type='checkbox' id={JSON.stringify({ repoID: repo.id, setting: option })} />
                          <label htmlFor={JSON.stringify({ repoID: repo.id, setting: option })}>Toggle</label>
                        </div>
                      </td>
                    )
                    : OPTIONS.map(i =>
                      <td key={i}>
                        <small className='text-muted'>Not admin</small>
                      </td>
                    )
                }
              </tr>
            ))
          }
        </tbody>
      </table>
      <Pagination reposPerPage={reposPerPage} totalRepos={repos.length} paginate={paginate} />
      {
        showSaveButton && <button onClick={handleSave} className='btn btn-dark fade-in'>Save settings</button>
      }
    </>
  )
}

export default HandleSettings
