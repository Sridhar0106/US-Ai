import { Schema, model } from 'mongoose';

const resourceSchema = new Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['article', 'video', 'course'], 
    required: true 
  },
  url: { type: String, default: '#' },
  completed: { type: Boolean, default: false },
});

const roadmapSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weakSkill: { type: String, required: true },
  resources: [resourceSchema],
}, {
  timestamps: true,
});

export const Roadmap = model('Roadmap', roadmapSchema);
export default Roadmap;
