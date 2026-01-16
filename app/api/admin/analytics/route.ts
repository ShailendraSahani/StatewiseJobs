import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/db';
import Job from '@/lib/models/Job';
import ExamCalendar from '@/lib/models/ExamCalendar';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Jobs by state (existing data)
    const stateCounts = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Jobs created over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const jobsOverTime = await Job.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, isActive: true } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Exams by status
    const examStatusCounts = await ExamCalendar.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Total counts
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalExams = await ExamCalendar.countDocuments({ isActive: true });

    return NextResponse.json({
      success: true,
      data: {
        stateCounts: stateCounts.map(item => ({ state: item._id, count: item.count })),
        jobsOverTime: jobsOverTime.map(item => ({ date: item._id, count: item.count })),
        examStatusCounts: examStatusCounts.map(item => ({ status: item._id, count: item.count })),
        totals: {
          jobs: totalJobs,
          exams: totalExams
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
