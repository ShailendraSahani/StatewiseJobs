import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/utils/db";
import User from "../../../../lib/models/User";
import { hashPassword, generateToken } from "../../../../lib/utils/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      isActive: true,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        },
        token
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}
