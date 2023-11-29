import mongoose from 'mongoose'

const { Schema } = mongoose

interface Friend extends Document {
  email: string
  distance: number
}

interface Notification extends Document {
  message: string
  status: 'unread' | 'read'
  createdAt: Date
}

interface User extends Document {
  email: string
  password?: string
  pets?: string[]
  latitude?: number
  longitude?: number
  address?: string
  friends?: Friend[]
  image?: string
  notifications?: Notification[]
}

const friendSchema = new Schema<Friend>({
  email: {
    type: String,
    required: true
  },
  distance: {
    type: Number
  }
})

const notificationSchema = new Schema<Notification>({
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

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
    },
    friends: [friendSchema],
    image: {
      type: String,
      default: null
    },
    notifications: [notificationSchema] // Adding notifications array to store notifications
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<User>('User', userSchema)
