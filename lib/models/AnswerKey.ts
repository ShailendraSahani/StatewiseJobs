import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswerKey extends Document {
  title: string;
  state: string;
  examDate: string;
  downloadLink: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerKeySchema: Schema = new Schema({
  title: { type: String, required: true },
  state: { type: String, required: true },
  examDate: { type: String, required: true },
  downloadLink: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.AnswerKey || mongoose.model<IAnswerKey>('AnswerKey', AnswerKeySchema);
