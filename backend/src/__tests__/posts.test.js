import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { createUser } from '../services/users.js'

let testUser = null
let samplePosts = []

beforeAll(async () => {
  testUser = await createUser({ username: 'dan', password: 'hunter2' })
  samplePosts = [
    { title: 'Learning Redux', author: testUser._id, tags: ['redux'] },
    { title: 'Learn React Hooks', author: testUser._id, tags: ['react'] },
    {
      title: 'Full-Stack React Projects',
      author: testUser._id,
      tags: ['react', 'nodejs'],
    },
  ]
})

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
    // we need to explicitly convert the id to a string, because it is an ObjectId object
    expect(String(foundPost.author?._id)).toMatch(String(testUser?._id))
  })

  test('without title should fail', async () => {
    const post = {
      contents: 'Post with no title',
      tags: ['empty'],
    }
    try {
      await createPost(testUser._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

let createdSamplePosts = []

beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor(testUser.username)
    expect(posts.length).toBe(3)
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })
})

describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Test Update',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.contents).toEqual('Test Update')
  })

  test('should not update other properties', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Test Update',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })

  test('should update the updatedAt timestamp', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Test Update',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const post = await updatePost(testUser._id, '000000000000000000000000', {
      contents: 'Test Update',
    })
    expect(post).toEqual(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(testUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })

  describe('recipe fields', () => {
    const eggsBenedict = {
      title: 'Eggs Benedict',
      contents: 'Poach the eggs, toast the muffins, stack.',
      ingredients: [
        { name: 'eggs', quantity: { amount: 6 }, unit: null },
        { name: 'Virginia ham', quantity: { amount: 6 }, unit: 'rounds' },
        { name: 'English muffins', quantity: { amount: 3 }, unit: null },
      ],
      imageUrl: 'https://example.com/eggs-benedict.jpg',
    }

    test('should store ingredients and imageUrl', async () => {
      const createdPost = await createPost(testUser._id, eggsBenedict)
      const foundPost = (await Post.findById(createdPost._id)).toObject()
      expect(foundPost.ingredients).toEqual(eggsBenedict.ingredients)
      expect(foundPost.imageUrl).toEqual(eggsBenedict.imageUrl)
    })

    test('should accept an uploaded image path', async () => {
      const createdPost = await createPost(testUser._id, {
        title: 'Uploaded',
        imageUrl: '/api/v1/images/000000000000000000000000',
      })
      expect(createdPost.imageUrl).toEqual(
        '/api/v1/images/000000000000000000000000',
      )
    })

    test('should reject an ingredient without a name', async () => {
      await expect(
        createPost(testUser._id, {
          title: 'Bad ingredient',
          ingredients: [{ quantity: { amount: 1 }, unit: 'cup' }],
        }),
      ).rejects.toBeInstanceOf(mongoose.Error.ValidationError)
    })

    test('should reject a non-http image URL', async () => {
      await expect(
        createPost(testUser._id, {
          title: 'Bad image',
          imageUrl: 'javascript:alert(1)',
        }),
      ).rejects.toBeInstanceOf(mongoose.Error.ValidationError)
    })

    test('should replace the ingredient list on update', async () => {
      const createdPost = await createPost(testUser._id, eggsBenedict)
      const updatedPost = await updatePost(testUser._id, createdPost._id, {
        ingredients: [{ name: 'eggs', quantity: { amount: 4 }, unit: null }],
      })
      expect(updatedPost.toObject().ingredients).toEqual([
        { name: 'eggs', quantity: { amount: 4 }, unit: null },
      ])
      expect(updatedPost.imageUrl).toEqual(eggsBenedict.imageUrl)
    })

    test('should validate fields on update', async () => {
      const createdPost = await createPost(testUser._id, eggsBenedict)
      await expect(
        updatePost(testUser._id, createdPost._id, { imageUrl: 'ftp://nope' }),
      ).rejects.toBeInstanceOf(mongoose.Error.ValidationError)
    })
  })

  describe('ownership', () => {
    let otherUser = null

    beforeAll(async () => {
      otherUser = await createUser({ username: 'mallory', password: 'hunter3' })
    })

    test('another user cannot update the post', async () => {
      const result = await updatePost(
        otherUser._id,
        createdSamplePosts[0]._id,
        {
          title: 'Hijacked',
        },
      )
      expect(result).toEqual(null)
      const post = await Post.findById(createdSamplePosts[0]._id)
      expect(post.title).toEqual('Learning Redux')
    })

    test('another user cannot delete the post', async () => {
      const result = await deletePost(otherUser._id, createdSamplePosts[0]._id)
      expect(result.deletedCount).toEqual(0)
      const post = await Post.findById(createdSamplePosts[0]._id)
      expect(post).not.toEqual(null)
    })
  })
})
