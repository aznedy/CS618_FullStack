export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

export const createPost = async (token, post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  })
  if (!res.ok) throw new Error('failed to create recipe')
  return await res.json()
}
export const getPostById = async (postId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`)
  if (res.status === 404) return null
  return await res.json()
}

export const updatePost = async (token, postId, post) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    },
  )
  if (!res.ok) throw new Error('failed to update recipe')
  return await res.json()
}

export const deletePost = async (token, postId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  if (!res.ok) throw new Error('failed to delete recipe')
}
