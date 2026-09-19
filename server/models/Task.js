import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  startup_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignee_name: { type: String, default: 'Unassigned' },
  assignee_email: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['todo', 'in_progress', 'review', 'done'], default: 'todo' },
  deadline: { type: Date },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
