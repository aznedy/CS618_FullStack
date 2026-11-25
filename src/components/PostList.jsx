import PropTypes from 'prop-types'
import { Post } from './Post.jsx'
export function PostList({ posts = [] }) {
  return (
    <div className='post-list'>
      {posts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
    </div>
  )
}
PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
