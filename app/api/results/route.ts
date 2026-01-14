import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import connectDB from '../../../lib/utils/db';
import Result, { IResult } from '@/lib/models/Result';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const query: FilterQuery<IResult> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const results = await Result.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Result.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        results,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const result = new Result(body);
    await result.save();

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create result' },
      { status: 500 }
    );
  }
}
