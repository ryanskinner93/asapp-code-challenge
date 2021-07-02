import axios from 'axios'

export default async function fetchPreferredCities() {
  const { data: { data } } = await axios.get('http://localhost:3030/preferences/cities')
  return data
}