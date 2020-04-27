import React, { useState, useContext } from 'react'
import axios from 'axios'
import { getUserID } from '../helpers/session'
import crypto from 'crypto-js'
import GlobalContext from '../context/GlobalContext'

/**
 * Render email settings
 */
const EmailSettings = () => {
  const context = useContext(GlobalContext)

  const [value, setValue] = useState('')

  const onSubmitHandler = event => {
    event.preventDefault()

    context.handleSavingSettingsLoadingEmail(true)

    const URL = 'https://github-server.perssonrichard.org/emailSettings'
    const userID = getUserID()
    const secret = process.env.REACT_APP_HOOK_SECRET
    const encryptedSecret = crypto.AES.encrypt(secret, process.env.REACT_APP_CRYPTO_SECRET).toString()

    // Save email address to DynamoDB
    axios({
      method: 'POST',
      url: URL,
      headers: { Authorization: encryptedSecret },
      data: {
        userID,
        email: value
      }
    })
      .then(res => {
        if (res.status === 200) {
          context.handleSavingSettingsLoadingEmail(false)
          context.handleSuccessfulSaveEmail(true)

          setTimeout(() => {
            context.handleSuccessfulSaveEmail(false)
          }, 2000)
        } else {
          throw new Error('Something went wronb when saving email settings.')
        }
      })
      .catch(err => {
        context.handleSavingSettingsLoading(false)
        context.handleCouldNotSaveEmail(true)

        console.log(err)
      })
  }

  const onChangeHandler = event => setValue(event.target.value)

  const savingAlert = () => {
    return (
      <div className='alert alert-secondary text-center mt-3' id='textLoadingSavingEmail' role='alert'>
          Saving<span>.</span><span>.</span><span>.</span>
      </div>
    )
  }

  const successfulSaveAlert = () => {
    return (
      <div className='alert alert-success text-center mt-3 fade-in' id='successfulSaveAlertEmail' role='alert'>
      Settings saved!
      </div>
    )
  }

  const unSuccessfulSaveAlert = () => {
    return (
      <div className='alert alert-danger text-center mt-3 fade-in' id='unSuccessfulSaveAlertEmail' role='alert'>
      Something went wrong :(
      </div>
    )
  }

  return (
    <div className='col'>
      <div className='card' id='settingsCard'>
        <div className='card-header'>
            Email Settings
        </div>
        <div className='card-body'>
          {
            context.savingSettingsLoadingEmail && savingAlert()
          }
          {
            context.successfulSaveEmail && successfulSaveAlert()
          }
          {
            context.couldNotSaveEmail && unSuccessfulSaveAlert()
          }

          <form onSubmit={onSubmitHandler}>
            <div className='form-group'>
              <label htmlFor='inputEmail'>Submit your email address if you'd like to get notifications on given settings while offline.</label>
              <input type='email' onChange={onChangeHandler} className='form-control' id='inputEmail' aria-describedby='emailHelp' />
              <small id='emailHelp' className='form-text text-muted'>We'll never share your email with anyone else.</small>
            </div>
            <button type='submit' className='btn btn-primary'>Save</button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default EmailSettings
