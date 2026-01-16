import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '../../../../lib/utils/db';
import AnswerKey from '../../../../lib/models/AnswerKey';
import { verifyToken } from '../../../../lib/utils/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    const updatedAnswerKey = await AnswerKey.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedAnswerKey) {
      return NextResponse.json(
        { success: false, error: 'Answer key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAnswerKey
    });
  } catch (error) {
    console.error('Error updating answer key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update answer key' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const deletedAnswerKey = await AnswerKey.findByIdAndDelete(id);

    if (!deletedAnswerKey) {
      return NextResponse.json(
        { success: false, error: 'Answer key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Answer key deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting answer key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete answer key' },
      { status: 500 }
    );
  }
}
