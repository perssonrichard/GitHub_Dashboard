import React, { useState } from 'react'
import GlobalContext from './GlobalContext'
import { getDecryptedToken } from '../helpers/session'
import axios from 'axios'
import crypto from 'crypto-js'

/**
 * Create a global state provider
 */
const GlobalState = props => {
  // Available views
  const VIEWS = {
    dashboard: 'dashboard',
    notifications: 'notifications',
    settings: 'settings',
    emailSettings: 'emailSettings'
  }

  /**
   * Context shared between components
   */
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  const [orgs, setOrgs] = useState([])
  const [loggingIn, setLoggingIn] = useState(false)
  const [currentOrg, setCurrentOrg] = useState({})
  const [loadingRepos, setLoadingRepos] = useState(true)
  const [currentView, setCurrentView] = useState(VIEWS.dashboard)
  const [successfulSave, setSuccessfulSave] = useState(false)
  const [couldNotSave, setCouldNotSave] = useState(false)
  const [savingSettingsLoading, setSavingSettingsLoading] = useState(false)
  const [fadeOutSaved, setFadeOutSaved] = useState(false)
  const [onEvent, setOnEvent] = useState({})
  const [newEvent, setNewEvent] = useState(false)
  const [repos, setRepos] = useState([])
  const [activeRepo, setActiveRepo] = useState('')
  const [savedNotifications, setSavedNotifications] = useState([])
  const [savingSettingsLoadingEmail, setSavingSettingsLoadingEmail] = useState(false)
  const [successfulSaveEmail, setSuccessfulSaveEmail] = useState(false)
  const [couldNotSaveEmail, setCouldNotSaveEmail] = useState(false)

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)
  const handleUser = data => setUser(data)
  const handleLoggingIn = bool => setLoggingIn(bool)
  const handleOrgs = data => setOrgs(data)
  const handleCurrentOrg = value => setCurrentOrg(value)
  const handleLoadingRepos = bool => setLoadingRepos(bool)
  const handleCurrentView = value => setCurrentView(value)
  const handleSavingSettingsLoading = bool => setSavingSettingsLoading(bool)
  const handleOnEvent = data => setOnEvent(data)
  const handleNewEvent = value => setNewEvent(value)
  const handleRepos = data => setRepos(data)
  const handleActiveRepo = value => setActiveRepo(value)
  const handleSavedNotifications = data => setSavedNotifications(data)
  const handleFadeOutSaved = bool => setFadeOutSaved(bool)
  const handleSavingSettingsLoadingEmail = bool => setSavingSettingsLoadingEmail(bool)
  const handleSuccessfulSaveEmail = bool => setSuccessfulSaveEmail(bool)
  const handleCouldNotSaveEmail = bool => setCouldNotSaveEmail(bool)

  /**
   * Save user settings to DynamoDB
   */
  const saveUserSettings = (userID, settings) => {
    const secret = process.env.REACT_APP_HOOK_SECRET
    const encryptedSecret = crypto.AES.encrypt(secret, process.env.REACT_APP_CRYPTO_SECRET).toString()
    const URL = 'https://github-server.perssonrichard.org/settings'

    axios({
      method: 'post',
      url: URL,
      data: JSON.stringify({ userID: userID, settings: settings }),
      headers: {
        Authorization: encryptedSecret,
        'content-type': 'application/json'
      }
    })
      .then(() => {
        setSavingSettingsLoading(false)
        setSuccessfulSave(true)

        setTimeout(() => {
          setFadeOutSaved(true)
          setSuccessfulSave(false)
        }, 2000)
      })
      .catch(err => {
        console.log(err.message)
        setCouldNotSave(true)
      })
  }

  /**
   * Save webhooks settings to DynamoDB
   */
  const handleHooks = (data) => {
    try {
      const endpoint = 'https://github-server.perssonrichard.org/webhook'
      const token = getDecryptedToken()

      data.forEach(async hook => {
        const setting = hook.setting
        const hookURL = hook.repo.hooks_url

        // Check if hook exist
        const getHook = await axios({
          method: 'GET',
          url: hookURL,
          headers: {
            Authorization: `token ${token}`
          }
        })

        // Update hook if it exists
        if (getHook.status === 200) {
          const payload = {
            active: true,
            events: setting,
            config: {
              url: endpoint,
              secret: process.env.REACT_APP_HOOK_SECRET,
              content_type: 'json',
              insecure_ssl: '0'
            }
          }

          // If repo has more than one hook we want to find ours
          let ourHookURL
          getHook.data.forEach(hook => {
            if (hook.config.url === endpoint) ourHookURL = hook.url
          })

          // Update our hook
          axios({
            method: 'PATCH',
            url: ourHookURL,
            data: payload,
            headers: {
              Authorization: `token ${token}`
            }
          })
            .then(() => {})
            .catch(err => {
              console.log(`ERROR: ${err.message} \n ERRORS: ${err.errors}`)
            })
        } else {
          const payload = {
            name: 'web',
            active: true,
            events: setting,
            config: {
              url: endpoint,
              secret: process.env.REACT_APP_HOOK_SECRET,
              content_type: 'json',
              insecure_ssl: '0'
            }
          }

          // Create a new hook
          axios({
            method: 'POST',
            url: hookURL,
            data: payload,
            headers: {
              Authorization: `token ${token}`
            }
          })
            .then()
            .catch(err => console.log(err))
        }
      })
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <GlobalContext.Provider value={{
      isLoggedIn,
      handleLogin,
      handleLogout,
      user,
      handleUser,
      orgs,
      currentOrg,
      handleOrgs,
      handleCurrentOrg,
      loggingIn,
      handleLoggingIn,
      loadingRepos,
      handleLoadingRepos,
      VIEWS,
      currentView,
      handleCurrentView,
      saveUserSettings,
      successfulSave,
      couldNotSave,
      handleHooks,
      savingSettingsLoading,
      handleSavingSettingsLoading,
      fadeOutSaved,
      handleFadeOutSaved,
      onEvent,
      handleOnEvent,
      newEvent,
      handleNewEvent,
      repos,
      handleRepos,
      activeRepo,
      handleActiveRepo,
      savedNotifications,
      handleSavedNotifications,
      savingSettingsLoadingEmail,
      couldNotSaveEmail,
      successfulSaveEmail,
      handleCouldNotSaveEmail,
      handleSavingSettingsLoadingEmail,
      handleSuccessfulSaveEmail
    }}
    >
      {props.children}
    </GlobalContext.Provider>
  )
}

export default GlobalState
