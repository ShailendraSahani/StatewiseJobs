import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '../../../../lib/utils/db';
import Result from '../../../../lib/models/Result';
import { verifyToken } from '../../../../lib/utils/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;
    const body = await request.json();

    const updatedResult = await Result.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedResult) {
      return NextResponse.json(
        { success: false, error: 'Result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedResult
    });
  } catch (error) {
    console.error('Error updating result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update result' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    const deletedResult = await Result.findByIdAndDelete(id);

    if (!deletedResult) {
      return NextResponse.json(
        { success: false, error: 'Result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete result' },
      { status: 500 }
    );
  }
}
