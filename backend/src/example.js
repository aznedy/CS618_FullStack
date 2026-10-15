import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'

await initDatabase()

const newPost = new Post({
  title: 'My First Post',
  author: 'Andrew Doe',
  contents: 'This is the content of my first post.',
  tags: ['introduction', 'first'],
})
const createdPost = await newPost.save()

await Post.findByIdAndUpdate(createdPost._id, {
  $set: { title: 'Updated Title' },
})

const posts = await Post.find()
console.info('All posts:', posts)
console.info('New post saved successfully:', createdPost)
