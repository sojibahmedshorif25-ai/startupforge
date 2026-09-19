import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author_name: { type: String, required: true },
  author_email: { type: String, required: true },
  author_image: { type: String, default: '' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  author_name: { type: String, required: true },
  author_email: { type: String, required: true },
  author_image: { type: String, default: '' },
  author_role: { type: String, default: 'collaborator' },
  title: { type: String, default: '' },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  likes: [{ type: String }],
  comments: [commentSchema],
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
