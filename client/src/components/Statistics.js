import React, { useContext, useEffect, useState } from 'react'
import GlobalContext from '../context/GlobalContext'
import 'tui-chart/dist/tui-chart.css'
import { BarChart } from '@toast-ui/react-chart'
import axios from 'axios'
import { getDecryptedToken } from '../helpers/session'

/**
 * Render statistics
 */
const Statistics = () => {
  const context = useContext(GlobalContext)

  const [contributors, setContributors] = useState()
  const [previousRepo, setPreviousRepo] = useState()
  const [noContent, setNoContent] = useState(false)

  useEffect(() => {
    if (previousRepo !== context.activeRepo) setPreviousRepo(context.activeRepo)

    const fakeLoading = setTimeout(() => {
      context.handleLoadingRepos(false)
    }, 2000)

    const url = `https://api.github.com/repos/${context.currentOrg.login}/${context.activeRepo}/stats`
    const contributorsURL = `${url}/contributors`
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const token = getDecryptedToken()
    const config = {
      headers: {
        Authorization: `token ${token}`
      },
      cancelToken: source.token
    }

    if (context.currentOrg.login !== undefined && context.activeRepo !== previousRepo) {
      // Get statistics from current repo
      axios.get(contributorsURL, config)
        .then(res => {
          res.status === 200 && setContributors(res.data) && setNoContent(false)
          res.status === 202 && setNoContent(true)
        })
        .catch(err => {
          if (!axios.isCancel(err)) {
            console.log(err)
          }
        })
    }

    // Cleanup timeout
    return () => {
      source.cancel()
      clearTimeout(fakeLoading)
    }
  }, [context.activeRepo, context.currentOrg])

  if (contributors && contributors !== {} && Object.keys(contributors).length !== 0) {
    const series = contributors.map(con => {
      return {
        name: con.author.login,
        data: [Number(con.total)]
      }
    })

    const data = {
      categories: ['Commits'],
      series
    }

    const options = {
      chart: {
        width: 600,
        height: 400,
        title: 'Total commits',
        format: '100'
      },
      yAxis: {
        title: 'Event'
      },
      xAxis: {
        title: 'Amount',
        min: 0,
        max: 300
      },
      series: {
        showLabel: true
      }
    }

    const renderLoading = () => {
      return (
        <p className='text-center mt-4 textLoadingRepos'>Loading repositories<span>.</span><span>.</span><span>.</span></p>
      )
    }

    return (
      <div>
        {
          context.loadingRepos
            ? renderLoading()
            : noContent
              ? 'No statistics available'
              : <BarChart data={data} options={options} />
        }
      </div>
    )
  }

  return null
}

export default Statistics
