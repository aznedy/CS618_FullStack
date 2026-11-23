import mongoose, { Schema } from 'mongoose'

// Uploaded images live in MongoDB, not on disk, because Cloud Run's disk
// is wiped whenever an instance restarts.
const imageSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
)

export const Image = mongoose.model('image', imageSchema)
