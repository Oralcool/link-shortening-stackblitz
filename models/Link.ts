import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickData: [{
    timestamp: Date,
    location: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Link = mongoose.models.Link || mongoose.model('Link', LinkSchema);