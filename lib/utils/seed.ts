import {connectDB} from './db';
import User from '../models/User';
import Footer from '../models/Footer';
import { hashPassword } from './auth';

async function seedAdmin() {
  try {
    await connectDB();

    const adminEmail = 'shailendrasahani273209@gmail.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(adminPassword);

    // Create admin user
    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: shailendrasahani273209@gmail.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    process.exit();
  }
}

async function seedFooter() {
  try {
    await connectDB();

    // Check if footer already exists
    const existingFooter = await Footer.findOne({ isActive: true });
    if (existingFooter) {
      console.log('Footer already exists');
      return;
    }

    // Create default footer
    const footer = new Footer({
      title: 'Statewise Jobs',
      description: 'Find government jobs across all states in India',
      links: [
        { text: 'Home', url: '/' },
        { text: 'Jobs', url: '/jobs' },
        { text: 'States', url: '/states' },
        { text: 'Contact', url: '/contact' },
      ],
      socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com' },
        { platform: 'Twitter', url: 'https://twitter.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
      ],
      copyright: '© 2024 Statewise Jobs. All rights reserved.',
      isActive: true,
    });

    await footer.save();
    console.log('Footer created successfully');
  } catch (error) {
    console.error('Error seeding footer:', error);
  }
}

async function runSeed() {
  await seedAdmin();
  await seedFooter();
  process.exit();
}

runSeed();
