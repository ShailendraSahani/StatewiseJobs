import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  state: string;
  category: string;
  vacancy: number;
  lastDate: string;
  salary: string;
  qualification: string;
  description?: string;
  applicationLink?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  state: { type: String, required: true },
  category: { type: String, required: true },
  vacancy: { type: Number, required: true },
  lastDate: { type: String, required: true },
  salary: { type: String, required: true },
  qualification: { type: String, required: true },
  description: { type: String },
  applicationLink: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
