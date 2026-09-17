import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user_email: { type: String, required: true },
    item_type: { type: String, enum: ['startup', 'opportunity'], required: true },
    startup_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
    opportunity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user_email: 1, item_type: 1, startup_id: 1, opportunity_id: 1 });

export default mongoose.model('Bookmark', bookmarkSchema);
