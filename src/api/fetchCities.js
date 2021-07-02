import axios from 'axios'

export default async function fetchCities() {
  const { data: { data: res } } = await axios.get('http://localhost:3030/cities')
  return res
}
