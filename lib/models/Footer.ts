import mongoose, { Schema, Document } from 'mongoose';

export interface IFooter extends Document {
  title: string;
  description: string;
  links: {
    text: string;
    url: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  copyright: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FooterSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  links: [{
    text: { type: String, required: true },
    url: { type: String, required: true }
  }],
  socialLinks: [{
    platform: { type: String, required: true },
    url: { type: String, required: true }
  }],
  copyright: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.Footer || mongoose.model<IFooter>('Footer', FooterSchema);
