import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import {connectDB} from '../../../lib/utils/db';
import Syllabus, { ISyllabus } from '../../../lib/models/Syllabus';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const query: FilterQuery<ISyllabus> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const syllabi = await Syllabus.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Syllabus.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        syllabi,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching syllabi:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch syllabi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const syllabus = new Syllabus(body);
    await syllabus.save();

    return NextResponse.json({
      success: true,
      data: syllabus
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating syllabus:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create syllabus' },
      { status: 500 }
    );
  }
}
