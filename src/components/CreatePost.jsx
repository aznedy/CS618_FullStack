import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { PostForm } from './PostForm.jsx'

export function CreatePost() {
  const [token] = useAuth()
  // Changing the key remounts PostForm, which resets it to empty.
  const [formKey, setFormKey] = useState(0)

  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: (post) => createPost(token, post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setFormKey((key) => key + 1)
    },
  })

  if (!token) return <div>Please log in to create new recipes.</div>

  return (
    <div>
      <h2>Add a recipe</h2>
      <PostForm
        key={formKey}
        idPrefix='create'
        submitLabel='Create'
        pendingLabel='Creating...'
        isPending={createPostMutation.isPending}
        onSubmit={(post) => createPostMutation.mutate(post)}
      />
      {createPostMutation.isSuccess && <div>Recipe created successfully!</div>}
      {createPostMutation.isError && (
        <div className='form-error'>{createPostMutation.error.message}</div>
      )}
    </div>
  )
}
