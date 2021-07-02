import axios from 'axios'

export default async function selectPreferredCity(id, selected) {
  const { data } = await axios.patch('http://localhost:3030/preferences/cities', {
    [`${id}`]: selected
  })
  return data
}