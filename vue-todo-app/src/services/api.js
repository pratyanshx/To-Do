const API_BASE = 'https://dummyjson.com'

// 🟩 GET all todos
export const getTodos = async () => {
  const res = await fetch(`${API_BASE}/todos`)
  const data = await res.json()
  return data.todos // ✅ extract array
}

// 🟩 GET all users
export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`)
  const data = await res.json()
  return data.users // ✅ extract array
}

// 🟨 CREATE a new todo
export const createTodo = async (todo) => {
  const res = await fetch(`${API_BASE}/todos/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo) // { todo: 'Buy milk', completed: false, userId: 5 }
  })
  const data = await res.json()
  return data
}

// 🟦 UPDATE a todo
export const updateTodo = async (id, updatedTodo) => {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTodo) // { completed: true }
  })
  const data = await res.json()
  return data
}

// 🟥 DELETE a todo
export const deleteTodo = async (id) => {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE'
  })
  const data = await res.json()
  return data
}
