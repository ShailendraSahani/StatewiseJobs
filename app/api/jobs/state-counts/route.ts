import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/db';
import Job from '@/lib/models/Job';

interface StateCountItem {
  _id: string;
  count: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const stateCounts = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const counts: { [key: string]: number } = {};
    stateCounts.forEach((item) => {
      counts[item._id] = item.count;
    });

    return NextResponse.json({
      success: true,
      data: counts
    });
  } catch (error) {
    console.error('Error fetching state counts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch state counts' },
      { status: 500 }
    );
  }
}
