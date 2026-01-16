import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '../../../../lib/utils/db';
import ExamCalendar from '../../../../lib/models/ExamCalendar';
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

    const updatedExam = await ExamCalendar.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedExam) {
      return NextResponse.json(
        { success: false, error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedExam
    });
  } catch (error) {
    console.error('Error updating exam calendar entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update exam calendar entry' },
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

    const deletedExam = await ExamCalendar.findByIdAndDelete(id);

    if (!deletedExam) {
      return NextResponse.json(
        { success: false, error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exam calendar entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete exam calendar entry' },
      { status: 500 }
    );
  }
}
