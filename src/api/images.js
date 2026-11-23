// Upload one image file. The browser will automatically set the multipart Content-Type
export const uploadImage = async (token, file) => {
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error ?? 'failed to upload image')
  return body // { url: '/api/v1/images/<id>' }
}

// Uploaded images are stored as a path on the backend, so the same data works regardless of the backend provider.
export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return null
  if (imageUrl.startsWith('/')) {
    return new URL(import.meta.env.VITE_BACKEND_URL).origin + imageUrl
  }
  return imageUrl
}
