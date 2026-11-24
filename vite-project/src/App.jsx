
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUser, addUser, updateUser, deleteUser } from './api'

const App = () => {
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [editId, setEditId] = useState(null)

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUser
  })

  const saveMutation = useMutation({
    mutationFn: (formData) => {
      if (editId !== null) {
        return updateUser({name,description,id: editId})
      }
      return addUser(formData)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setName('')
      setDescription('')
      setImage(null)
      setEditId(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('Name', name)
    formData.append('Description', description)
    if (image) {formData.append('Images', image)}
    saveMutation.mutate(formData)
  }

  const handleEdit = (user) => {
    setEditId(user.id)
    setName(user.name)
    setDescription(user.description)
  }

  const handleCancel = () => {
    setEditId(null)
    setName('')
    setDescription('')
    setImage(null)
  }

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Error loading data!</h1>

  return (
    <div>
      <h1>ToDo CRUD</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>
        <button >{saveMutation.isPending ? 'Loading...' : editId ? 'Update' : 'Add'} </button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
      <hr />
      {data.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.description}</p>
          {user.images?.map((img) => (
            <img  src={`https://to-dos-api.softclub.tj/images/${img.imageName}`} width="100"/>
          ))}
          <br />
          <button onClick={() => handleEdit(user)}>Edit</button>
          <button onClick={() => deleteMutation.mutate(user.id)} disabled={deleteMutation.isPending}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  )
}
export default App