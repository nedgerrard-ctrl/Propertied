import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  await connectDB();

  const now = new Date();

  // ── Monthly breakdown: last 13 months (so we always have 12 full months) ──
  const monthStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthlyRaw = await Enquiry.aggregate([
    { $match: { createdAt: { $gte: monthStart } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          enquiryType: "$enquiryType",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Build the 12-month labels array
  const months: {
    label: string;
    year: number;
    month: number;
    total: number;
    buyer: number;
    developer: number;
    general: number;
  }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString("en-AU", { month: "short", year: "2-digit" }),
      year: d.getFullYear(),
      month: d.getMonth() + 1, // 1-indexed
      total: 0,
      buyer: 0,
      developer: 0,
      general: 0,
    });
  }

  for (const row of monthlyRaw) {
    const slot = months.find(
      (m) => m.year === row._id.year && m.month === row._id.month
    );
    if (!slot) continue;
    slot.total += row.count;
    const t = row._id.enquiryType as string;
    if (t === "buyer") slot.buyer += row.count;
    else if (t === "developer") slot.developer += row.count;
    else slot.general += row.count;
  }

  // ── This month vs last month ──
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthCount, lastMonthCount] = await Promise.all([
    Enquiry.countDocuments({ createdAt: { $gte: thisMonthStart } }),
    Enquiry.countDocuments({
      createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
    }),
  ]);

  // ── By type (all time) ──
  const byTypeRaw = await Enquiry.aggregate([
    { $group: { _id: "$enquiryType", count: { $sum: 1 } } },
  ]);
  const byType = [
    { name: "Buyer", key: "buyer", count: 0 },
    { name: "Developer", key: "developer", count: 0 },
    { name: "General", key: "general", count: 0 },
  ];
  for (const row of byTypeRaw) {
    const slot = byType.find((t) => t.key === row._id);
    if (slot) slot.count = row.count;
  }

  // ── By status (all time) ──
  const byStatusRaw = await Enquiry.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const byStatus = [
    { name: "Pending", key: "pending", count: 0 },
    { name: "Qualified", key: "qualified", count: 0 },
    { name: "In Progress", key: "in-progress", count: 0 },
    { name: "Closed", key: "closed", count: 0 },
  ];
  for (const row of byStatusRaw) {
    const slot = byStatus.find((s) => s.key === row._id);
    if (slot) slot.count = row.count;
  }

  // ── Total & pending counts ──
  const [total, pendingCount] = await Promise.all([
    Enquiry.countDocuments({}),
    Enquiry.countDocuments({ status: "pending" }),
  ]);

  return NextResponse.json({
    summary: {
      total,
      thisMonth: thisMonthCount,
      lastMonth: lastMonthCount,
      pending: pendingCount,
    },
    monthly: months,
    byType,
    byStatus,
  });
}
