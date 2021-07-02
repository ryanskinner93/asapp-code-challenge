import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { debounce } from 'lodash'

import './Search.css'

export default function Search(props) {
  const {
    items,
    searchOptions,
    renderItem,
    cursor,
    onNextCursor,
    onResetCursor
  } = props
  const [input, setInput] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const debouncedSearch = useMemo(() => debounce((val) => setInput(val), 500), [])

  const fuse = useMemo(() => {
    return new Fuse(items, searchOptions)
  }, [items, searchOptions])

  useEffect(() => {
    const result = fuse.search(input)
    setSearchResults(result)
    onResetCursor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, fuse])

  function handleScroll(e) {
    let element = e.target
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      onNextCursor()
    }
  }

  function getResults() {
    if (input.length && !searchResults.length) return []
    return searchResults.length ? searchResults : items
  }

  return (
    <div className="search-container">
      <input
        placeholder='Search by city name or country'
        className='search-input'
        type='text'
        onChange={e => debouncedSearch(e.target.value)}
      />
      <i className="fa fa-search"></i>
      {items && items.length ? (
        <div className="results-container" onScroll={handleScroll}>
          {getResults().slice(0, cursor).map((res, i) => {
            const data = res.item ? res.item : res
            return renderItem(data, i)
          })}
        </div>
      ) : null}
    </div>
  )
}
