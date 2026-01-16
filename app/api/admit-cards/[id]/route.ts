import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '../../../../lib/utils/db';
import AdmitCard from '../../../../lib/models/AdmitCard';
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

    const updatedAdmitCard = await AdmitCard.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedAdmitCard) {
      return NextResponse.json(
        { success: false, error: 'Admit card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAdmitCard
    });
  } catch (error) {
    console.error('Error updating admit card:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admit card' },
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

    const deletedAdmitCard = await AdmitCard.findByIdAndDelete(id);

    if (!deletedAdmitCard) {
      return NextResponse.json(
        { success: false, error: 'Admit card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admit card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admit card:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete admit card' },
      { status: 500 }
    );
  }
}
