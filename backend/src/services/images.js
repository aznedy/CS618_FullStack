import { Image } from '../db/models/image.js'

export async function saveImage(userId, { buffer, mimetype, size }) {
  const image = new Image({
    owner: userId,
    contentType: mimetype,
    size,
    data: buffer,
  })
  return await image.save()
}

export async function getImageById(imageId) {
  return await Image.findById(imageId)
}
