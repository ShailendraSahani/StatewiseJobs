import mongoose, { Schema, Document } from 'mongoose';

export interface ISyllabus extends Document {
  title: string;
  state: string;
  downloadLink: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SyllabusSchema: Schema = new Schema({
  title: { type: String, required: true },
  state: { type: String, required: true },
  downloadLink: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.Syllabus || mongoose.model<ISyllabus>('Syllabus', SyllabusSchema);
