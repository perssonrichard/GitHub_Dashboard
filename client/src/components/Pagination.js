import React from 'react'

/**
 * Render a pagination bar
 */
const Pagination = ({ reposPerPage, totalRepos, paginate }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalRepos / reposPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <button onClick={() => paginate(number)} className='page-link'>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Pagination
