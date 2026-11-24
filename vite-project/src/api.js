import axios from 'axios'

const api = axios.create({
  baseURL: 'https://to-dos-api.softclub.tj/api'
})

export const getUser = async () => {
  const res = await api.get('/to-dos')
  return res.data.data
}

export const addUser = async (data) => {
  return await api.post('/to-dos', data)
}

export const updateUser = async (data) => {
  return await api.put('/to-dos', data)
}

export const deleteUser = async (id) => {
  return await api.delete(`/to-dos?id=${id}`)
}