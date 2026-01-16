import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '../../../../lib/utils/db';
import Syllabus from '../../../../lib/models/Syllabus';
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

    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedSyllabus) {
      return NextResponse.json(
        { success: false, error: 'Syllabus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSyllabus
    });
  } catch (error) {
    console.error('Error updating syllabus:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update syllabus' },
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

    const deletedSyllabus = await Syllabus.findByIdAndDelete(id);

    if (!deletedSyllabus) {
      return NextResponse.json(
        { success: false, error: 'Syllabus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Syllabus deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting syllabus:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete syllabus' },
      { status: 500 }
    );
  }
}
