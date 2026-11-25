import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { User } from './User.jsx'
import { resolveImageUrl } from '../api/images.js'
// Optional readable slug for /posts/:postId/:slug? — the page loads by id, not slug.
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}
function formatIngredient(ingredient) {
  const amount = ingredient.quantity?.amount
  const parts = [
    amount !== undefined && amount !== null ? String(amount) : null,
    ingredient.unit,
    ingredient.name,
  ].filter(Boolean)
  return parts.join(' ')
}
export function Post({
  _id,
  title,
  contents,
  author,
  imageUrl,
  ingredients,
  fullPost = false,
}) {
  const src = resolveImageUrl(imageUrl)
  return (
    <article className={fullPost ? 'recipe-full' : 'recipe-card'}>
      {src && <img className='recipe-card__image' src={src} alt={title} />}
      <h3 className='recipe-card__title'>
        {fullPost || !_id ? (
          title
        ) : (
          <Link to={`/posts/${_id}/${slugify(title)}`}>{title}</Link>
        )}
      </h3>
      {fullPost && ingredients?.length > 0 && (
        <section>
          <h4>Ingredients</h4>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{formatIngredient(ingredient)}</li>
            ))}
          </ul>
        </section>
      )}
      {fullPost && contents && (
        <div className='recipe-full__contents'>{contents}</div>
      )}
      {author && (
        <em className='recipe-card__meta'>
          <br />
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}
Post.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  imageUrl: PropTypes.string,
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      quantity: PropTypes.shape({ amount: PropTypes.number }),
      unit: PropTypes.string,
    }),
  ),
  fullPost: PropTypes.bool,
}
