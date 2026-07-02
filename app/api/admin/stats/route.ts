import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

const TYPE_LABELS: Record<string, string> = {
  buyer: "Buyer",
  developer: "Developer",
  general: "General",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  qualified: "Qualified",
  "in-progress": "In Progress",
  closed: "Closed",
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  await connectDB();

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const filter = { isDeleted: { $ne: true } };

  const [total, thisMonth, lastMonth, pending, typeAgg, statusAgg, monthlyAgg] =
    await Promise.all([
      Enquiry.countDocuments(filter),
      Enquiry.countDocuments({ ...filter, createdAt: { $gte: startOfThisMonth } }),
      Enquiry.countDocuments({
        ...filter,
        createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
      }),
      Enquiry.countDocuments({ ...filter, status: "pending" }),
      Enquiry.aggregate([
        { $match: filter },
        { $group: { _id: "$enquiryType", count: { $sum: 1 } } },
      ]),
      Enquiry.aggregate([
        { $match: filter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Enquiry.aggregate([
        { $match: { ...filter, createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              type: "$enquiryType",
            },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  const typeCounts: Record<string, number> = { buyer: 0, developer: 0, general: 0 };
  for (const t of typeAgg) {
    if (t._id in typeCounts) typeCounts[t._id as string] = t.count;
  }

  const statusCounts: Record<string, number> = {
    pending: 0,
    qualified: 0,
    "in-progress": 0,
    closed: 0,
  };
  for (const s of statusAgg) {
    if (s._id in statusCounts) statusCounts[s._id as string] = s.count;
  }

  const monthlyMap = new Map<string, { buyer: number; developer: number; general: number }>();
  for (const m of monthlyAgg) {
    const key = `${m._id.year}-${m._id.month}`;
    const entry = monthlyMap.get(key) ?? { buyer: 0, developer: 0, general: 0 };
    if (m._id.type in entry) {
      entry[m._id.type as keyof typeof entry] = m.count;
    }
    monthlyMap.set(key, entry);
  }

  const monthly = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const entry = monthlyMap.get(key) ?? { buyer: 0, developer: 0, general: 0 };
    monthly.push({
      label: `${MONTH_LABELS[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`,
      total: entry.buyer + entry.developer + entry.general,
      buyer: entry.buyer,
      developer: entry.developer,
      general: entry.general,
    });
  }

  return NextResponse.json({
    summary: { total, thisMonth, lastMonth, pending },
    monthly,
    byType: Object.entries(typeCounts).map(([key, count]) => ({
      key,
      name: TYPE_LABELS[key],
      count,
    })),
    byStatus: Object.entries(statusCounts).map(([key, count]) => ({
      key,
      name: STATUS_LABELS[key],
      count,
    })),
  });
}
