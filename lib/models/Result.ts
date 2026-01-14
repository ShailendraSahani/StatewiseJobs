import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  title: string;
  state: string;
  resultDate: string;
  downloadLink: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema: Schema = new Schema({
  title: { type: String, required: true },
  state: { type: String, required: true },
  resultDate: { type: String, required: true },
  downloadLink: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
