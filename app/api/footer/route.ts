import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '../../../lib/utils/db';
import Footer from '@/lib/models/Footer';
import { verifyToken } from '../../../lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const footer = await Footer.findOne({ isActive: true });

    if (!footer) {
      return NextResponse.json(
        { success: false, error: 'Footer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: footer
    });
  } catch (error) {
    console.error('Error fetching footer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch footer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const footer = new Footer(body);
    await footer.save();

    return NextResponse.json({
      success: true,
      data: footer
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating footer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create footer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    const footer = await Footer.findByIdAndUpdate(id, updateData, { new: true });

    if (!footer) {
      return NextResponse.json(
        { success: false, error: 'Footer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: footer
    });
  } catch (error) {
    console.error('Error updating footer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update footer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Footer ID is required' },
        { status: 400 }
      );
    }

    const footer = await Footer.findByIdAndDelete(id);

    if (!footer) {
      return NextResponse.json(
        { success: false, error: 'Footer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Footer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting footer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete footer' },
      { status: 500 }
    );
  }
}
