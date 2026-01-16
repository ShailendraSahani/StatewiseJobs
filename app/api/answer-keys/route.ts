import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import {connectDB} from '../../../lib/utils/db';
import AnswerKey, { IAnswerKey } from '../../../lib/models/AnswerKey';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const query: FilterQuery<IAnswerKey> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const answerKeys = await AnswerKey.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await AnswerKey.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        answerKeys,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching answer keys:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch answer keys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const answerKey = new AnswerKey(body);
    await answerKey.save();

    return NextResponse.json({
      success: true,
      data: answerKey
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating answer key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create answer key' },
      { status: 500 }
    );
  }
}
