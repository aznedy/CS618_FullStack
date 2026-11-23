import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePost } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { PostForm } from './PostForm.jsx'

export function EditPost({ post, onDone }) {
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const updatePostMutation = useMutation({
    mutationFn: (changes) => updatePost(token, post._id, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', post._id] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      onDone()
    },
  })

  return (
    <div>
      <h2>Edit recipe</h2>
      <PostForm
        idPrefix='edit'
        initialPost={post}
        submitLabel='Save changes'
        pendingLabel='Saving...'
        isPending={updatePostMutation.isPending}
        onSubmit={(changes) => updatePostMutation.mutate(changes)}
      />
      <button type='button' className='button-secondary' onClick={onDone}>
        Cancel
      </button>
      {updatePostMutation.isError && (
        <div className='form-error'>{updatePostMutation.error.message}</div>
      )}
    </div>
  )
}

EditPost.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onDone: PropTypes.func.isRequired,
}
