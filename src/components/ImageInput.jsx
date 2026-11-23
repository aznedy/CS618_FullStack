import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { uploadImage, resolveImageUrl } from '../api/images.js'

const MAX_BYTES = 2 * 1024 * 1024
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif'

export function ImageInput({ idPrefix, value, onChange }) {
  const [token] = useAuth()
  const [mode, setMode] = useState(
    value?.startsWith('/api/v1/images/') ? 'upload' : 'url',
  )
  const [localPreview, setLocalPreview] = useState(null)
  const [fileError, setFileError] = useState(null)

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadImage(token, file),
    onSuccess: (data) => onChange(data.url),
  })

  // Free the in-memory preview URL on changes or unmount.
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    setFileError(null)
    if (!file) return
    if (file.size > MAX_BYTES) {
      setFileError('Please choose an image under 2 MB.')
      return
    }
    setLocalPreview(URL.createObjectURL(file))
    uploadMutation.mutate(file)
  }

  const previewSrc =
    mode === 'upload' ? localPreview ?? resolveImageUrl(value) : value
  const showPreview =
    mode === 'upload'
      ? Boolean(previewSrc)
      : Boolean(value?.startsWith('http://') || value?.startsWith('https://'))

  return (
    <fieldset>
      <legend>Image</legend>
      <div className='image-input__modes'>
        <label htmlFor={`${idPrefix}-image-mode-url`}>
          <input
            type='radio'
            id={`${idPrefix}-image-mode-url`}
            name={`${idPrefix}-image-mode`}
            checked={mode === 'url'}
            onChange={() => setMode('url')}
          />{' '}
          Link to an image
        </label>
        <label htmlFor={`${idPrefix}-image-mode-upload`}>
          <input
            type='radio'
            id={`${idPrefix}-image-mode-upload`}
            name={`${idPrefix}-image-mode`}
            checked={mode === 'upload'}
            onChange={() => setMode('upload')}
          />{' '}
          Upload a file
        </label>
      </div>

      {mode === 'url' ? (
        <div key='url'>
          <label htmlFor={`${idPrefix}-image-url`}>Image URL: </label>
          <input
            type='url'
            id={`${idPrefix}-image-url`}
            placeholder='https://...'
            value={value?.startsWith('/') ? '' : value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : (
        <div key='upload'>
          <label htmlFor={`${idPrefix}-image-file`}>Image file: </label>
          <input
            type='file'
            id={`${idPrefix}-image-file`}
            accept={ACCEPTED}
            onChange={handleFile}
          />
          {uploadMutation.isPending && <div>Uploading...</div>}
          {fileError && <div className='form-error'>{fileError}</div>}
          {uploadMutation.isError && (
            <div className='form-error'>{uploadMutation.error.message}</div>
          )}
        </div>
      )}

      {showPreview && (
        <img className='image-preview' src={previewSrc} alt='Recipe preview' />
      )}
      {value && (
        <button
          type='button'
          className='button-secondary'
          onClick={() => {
            setLocalPreview(null)
            onChange('')
          }}
        >
          Remove image
        </button>
      )}
    </fieldset>
  )
}

ImageInput.propTypes = {
  idPrefix: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}
