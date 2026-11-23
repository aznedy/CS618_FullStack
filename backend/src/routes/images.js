import { requireAuth } from '../middleware/jwt.js'
import { uploadImage } from '../middleware/upload.js'
import { saveImage, getImageById } from '../services/images.js'

export function imageRoutes(app) {
  app.post('/api/v1/images', requireAuth, (req, res) => {
    uploadImage(req, res, async (err) => {
      if (err) {
        const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400
        return res.status(status).json({ error: err.message })
      }
      if (!req.file) {
        return res.status(400).json({
          error: 'send one jpeg, png, webp or gif in the "image" field',
        })
      }
      try {
        const image = await saveImage(req.auth.sub, req.file)
        return res.status(201).json({ url: `/api/v1/images/${image._id}` })
      } catch (err) {
        console.error('error saving image', err)
        return res.status(500).end()
      }
    })
  })

  app.get('/api/v1/images/:id', async (req, res) => {
    try {
      const image = await getImageById(req.params.id)
      if (image === null) return res.status(404).end()
      res.set({
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      })
      return res.send(image.data)
    } catch (err) {
      return res.status(404).end()
    }
  })
}
