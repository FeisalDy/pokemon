import mongoose from 'mongoose'

const { Schema } = mongoose

type User = {
  email: string
  password?: string
  pets?: string[]
  latitude?: number
  longitude?: number
  address?: string
}

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: false
    },
    pets: [{ type: String }],
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    address: {
      type: String,
      default: null
    }
  },

  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', userSchema)
