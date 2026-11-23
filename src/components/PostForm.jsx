import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  IngredientEditor,
  emptyIngredientRow,
  toIngredientRows,
  toIngredients,
} from './IngredientEditor.jsx'
import { ImageInput } from './ImageInput.jsx'

// Format the data for the database schema.
export function PostForm({
  idPrefix,
  initialPost = {},
  submitLabel,
  pendingLabel,
  isPending,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialPost.title ?? '')
  const [contents, setContents] = useState(initialPost.contents ?? '')
  const [imageUrl, setImageUrl] = useState(initialPost.imageUrl ?? '')
  const [ingredientRows, setIngredientRows] = useState(() =>
    initialPost.ingredients?.length
      ? toIngredientRows(initialPost.ingredients)
      : [emptyIngredientRow()],
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      contents,
      imageUrl,
      ingredients: toIngredients(ingredientRows),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-row'>
        <label htmlFor={`${idPrefix}-title`}>Title: </label>
        <input
          type='text'
          name={`${idPrefix}-title`}
          id={`${idPrefix}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='form-row'>
        <IngredientEditor
          idPrefix={idPrefix}
          rows={ingredientRows}
          onChange={setIngredientRows}
        />
      </div>
      <div className='form-row'>
        <ImageInput
          idPrefix={idPrefix}
          value={imageUrl}
          onChange={setImageUrl}
        />
      </div>
      <div className='form-row'>
        <label htmlFor={`${idPrefix}-contents`}>Instructions: </label>
        <textarea
          id={`${idPrefix}-contents`}
          value={contents}
          onChange={(e) => setContents(e.target.value)}
        />
      </div>
      <input
        type='submit'
        value={isPending ? pendingLabel : submitLabel}
        disabled={!title || isPending}
      />
    </form>
  )
}

PostForm.propTypes = {
  idPrefix: PropTypes.string.isRequired,
  initialPost: PropTypes.object,
  submitLabel: PropTypes.string.isRequired,
  pendingLabel: PropTypes.string.isRequired,
  isPending: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}
