import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '../../../lib/utils/db';
import ExamCalendar from '../../../lib/models/ExamCalendar';
import { verifyToken } from '../../../lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const state = searchParams.get('state');
    const upcoming = searchParams.get('upcoming') === 'true';

    let query: any = { isActive: true };

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (state) {
      query.state = state;
    }

    if (upcoming) {
      query.examDate = { $gte: new Date() };
      query.status = { $in: ['upcoming', 'ongoing'] };
    }

    const exams = await ExamCalendar.find(query)
      .sort({ examDate: 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await ExamCalendar.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        exams,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching exam calendar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exam calendar' },
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
    const examCalendar = new ExamCalendar(body);
    await examCalendar.save();

    return NextResponse.json({
      success: true,
      data: examCalendar
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating exam calendar entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create exam calendar entry' },
      { status: 500 }
    );
  }
}
