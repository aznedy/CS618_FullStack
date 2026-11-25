import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { EditPost } from '../components/EditPost.jsx'
import { getPostById, deletePost } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function ViewPost({ postId }) {
  const [token] = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
  const post = postQuery.data

  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(token, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      navigate('/')
    },
  })

  // Showing the buttons is a convenience. The backend still checks
  // ownership on every PATCH and DELETE.
  const isOwner = Boolean(token && post && jwtDecode(token).sub === post.author)

  const handleDelete = () => {
    if (window.confirm('Delete this recipe? This cannot be undone.')) {
      deletePostMutation.mutate()
    }
  }

  return (
    <div>
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      {postQuery.isLoading && <div>Loading recipe...</div>}
      {!postQuery.isLoading && !post && `Recipe with id ${postId} not found.`}
      {post && !isEditing && (
        <div>
          <Post {...post} fullPost />
          {isOwner && (
            <p>
              <button type='button' onClick={() => setIsEditing(true)}>
                Edit recipe
              </button>{' '}
              <button
                type='button'
                className='button-danger'
                onClick={handleDelete}
                disabled={deletePostMutation.isPending}
              >
                {deletePostMutation.isPending ? 'Deleting...' : 'Delete recipe'}
              </button>
            </p>
          )}
          {deletePostMutation.isError && (
            <div className='form-error'>{deletePostMutation.error.message}</div>
          )}
        </div>
      )}
      {post && isEditing && (
        <EditPost post={post} onDone={() => setIsEditing(false)} />
      )}
    </div>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
