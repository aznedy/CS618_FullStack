import mongoose, { Schema } from 'mongoose'

// Single ingredient line, e.g. { name ': 'Flour', quantity: '2', unti: 'cups' }
// No addressing of single ingredients by its id.

const ingredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    quantity: {
      amount: { type: Number, min: 0 },
    },
    unit: { type: String, trim: true, maxlength: 30, default: null },
  },
  { _id: false },
)

// Image URL / uplaod path validator

function validateImageUrl(value) {
  if (value === undefined || value === null || value === '') return true
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('api/v1/images/')
  )
}

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: String,
    tags: [String],
    ingredients: {
      type: [ingredientSchema],
      validate: {
        validator: (list) => list.length <= 50,
        message: 'a recipe can have at most 50 ingredients',
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: validateImageUrl,
        message: 'imageUrl must be an http(s) URL or an uploaded image path',
      },
    },
  },
  { timestamps: true },
)

export const Post = mongoose.model('post', postSchema)
