import { useEffect, useState } from "react";

import Search from "./components/Search";
import fetchCities from "./api/fetchCities";
import fetchPreferredCities from "./api/fetchPreferredCities";
import selectPreferredCity from "./api/selectPreferredCity";

const searchOptions = {
  keys: [{ name: 'country', weight: 2 }, { name: 'name' }, { name: 'subcountry' }]
}

export default function CitySearch() {
  const [cities, setCities] = useState([])
  const [preferredCities, setPreferredCities] = useState([])
  const [cursor, setCursor] = useState(10)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  async function fetchInitialData() {
    try {
      const [cities, preferredCities] = await Promise.all([fetchCities(), fetchPreferredCities()])

      const preferredTable = preferredCities.reduce((table, id) => {
        table[id] = true
        return table
      }, {})
  
      setCities(cities)
      setPreferredCities(preferredTable)
    } catch(e) {
      setError('Uh oh! There was a problem getting every single city in the entire world 🤷. Please refresh and try again.')
    }
  }

  async function handleCheckbox(checked, id) {
    try {
      setPreferredCities(prev => ({ ...prev, [id]: checked }))
      await selectPreferredCity(id, checked)
    } catch(e) {
      setError('Uh oh! There was a problem on our end 🤷. Please refresh and try again.')
    }
  }

  function renderCityItem(data, i) {
    const { name, country, subcountry, geonameid } = data
    return (
      <div className="result-item" key={i}>
        <input
          type="checkbox"
          className="checkbox"
          onChange={e => handleCheckbox(e.target.checked, geonameid)}
          checked={preferredCities[geonameid] || false}
        />
        <div className="city-names">
          <h3>{name}</h3>
          <div className="city-meta">
            {`${subcountry} - ${country}`}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <p className="error-text">{error}</p>
  }

  if (!cities.length) {
    return (
      <div className="fa-3x">
        <i className="fas fa-spinner fa-pulse"></i>
      </div>
    )
  }

  return (
    <Search
      items={cities}
      searchOptions={searchOptions}
      renderItem={renderCityItem}
      cursor={cursor}
      onNextCursor={() => setCursor(prev => prev + 10)}
      onResetCursor={() => setCursor(10)}
    />
  )
}
