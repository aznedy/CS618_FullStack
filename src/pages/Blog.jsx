import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import { getPosts } from '../api/posts.js'
import { getUserInfo } from '../api/users.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function Blog() {
  const [token] = useAuth()
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })
  const posts = postsQuery.data ?? []

  // Same query key as the User component, so this reuses its cached result.
  const userId = token ? jwtDecode(token).sub : null
  const userInfoQuery = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserInfo(userId),
    enabled: Boolean(userId),
  })
  const myUsername = userInfoQuery.data?.username

  return (
    <div>
      <Header />
      <h1>Welcome to the McDuck Recipes Blog!</h1>
      <hr />
      <CreatePost />
      <hr />
      Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      {myUsername && (
        <p>
          <button
            type='button'
            className='button-secondary'
            onClick={() => setAuthor(author === myUsername ? '' : myUsername)}
          >
            {author === myUsername ? 'Show all recipes' : 'Show my recipes'}
          </button>
        </p>
      )}
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
