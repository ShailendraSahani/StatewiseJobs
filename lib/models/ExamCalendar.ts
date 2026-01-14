import mongoose, { Schema, Document } from 'mongoose';

export interface IExamCalendar extends Document {
  title: string;
  examName: string;
  examDate: Date;
  applicationStartDate: Date;
  applicationEndDate: Date;
  resultDate?: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
  organization: string;
  category: string;
  state?: string;
  notificationLink?: string;
  applicationLink?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExamCalendarSchema: Schema = new Schema({
  title: { type: String, required: true },
  examName: { type: String, required: true },
  examDate: { type: Date, required: true },
  applicationStartDate: { type: Date, required: true },
  applicationEndDate: { type: Date, required: true },
  resultDate: { type: Date },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  description: { type: String },
  organization: { type: String, required: true },
  category: { type: String, required: true },
  state: { type: String },
  notificationLink: { type: String },
  applicationLink: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

// Index for efficient queries
ExamCalendarSchema.index({ examDate: 1, status: 1 });
ExamCalendarSchema.index({ category: 1 });
ExamCalendarSchema.index({ state: 1 });

export default mongoose.models.ExamCalendar || mongoose.model<IExamCalendar>('ExamCalendar', ExamCalendarSchema);
