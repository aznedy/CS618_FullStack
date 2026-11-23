import { describe, expect, test, beforeAll } from '@jest/globals'
import { saveImage, getImageById } from '../services/images.js'
import { createUser } from '../services/users.js'

let testUser = null

beforeAll(async () => {
  testUser = await createUser({ username: 'imageuser', password: 'hunter2' })
})

describe('images', () => {
  test('should save and load an image', async () => {
    const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47])
    const saved = await saveImage(testUser._id, {
      buffer,
      mimetype: 'image/png',
      size: buffer.length,
    })
    const loaded = await getImageById(saved._id)
    expect(loaded.contentType).toEqual('image/png')
    expect(Buffer.compare(loaded.data, buffer)).toEqual(0)
  })

  test('should return null for an unknown id', async () => {
    const loaded = await getImageById('000000000000000000000000')
    expect(loaded).toEqual(null)
  })
})
