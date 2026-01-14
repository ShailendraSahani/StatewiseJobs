import connectDB from './db';
import User from '../models/User';
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

seedAdmin();
