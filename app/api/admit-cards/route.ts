import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import {connectDB} from '../../../lib/utils/db';
import AdmitCard, { IAdmitCard } from '../../../lib/models/AdmitCard';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const query: FilterQuery<IAdmitCard> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const admitCards = await AdmitCard.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await AdmitCard.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        admitCards,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admit cards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admit cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const admitCard = new AdmitCard(body);
    await admitCard.save();

    return NextResponse.json({
      success: true,
      data: admitCard
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admit card:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admit card' },
      { status: 500 }
    );
  }
}
