"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type MonthSlot = {
  label: string;
  total: number;
  buyer: number;
  developer: number;
  general: number;
};

type TypeSlot = { name: string; key: string; count: number };
type StatusSlot = { name: string; key: string; count: number };

type Stats = {
  summary: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    pending: number;
  };
  monthly: MonthSlot[];
  byType: TypeSlot[];
  byStatus: StatusSlot[];
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const GOLD = "#b89464";
const DARK = "#2f2923";
const MID = "#a49a8d";
const LIGHT = "#ddd5c8";

const TYPE_COLORS: Record<string, string> = {
  buyer: GOLD,
  developer: DARK,
  general: MID,
};

const TYPE_LABEL: Record<string, string> = {
  buyer: "Buyer / Investor",
  developer: "Developer",
  general: "General",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  qualified: "#10b981",
  "in-progress": "#3b82f6",
  closed: "#9ca3af",
};

type ExpandedChart = "trends" | "monthly" | "source" | "status" | null;

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconExpand() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 16.25v-4.5m0 4.5h4.5m-4.5 0L9 11M16.25 3.75h-4.5m4.5 0v4.5m0-4.5L11 9M16.25 16.25h-4.5m4.5 0v-4.5m0 4.5L11 11"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

type ExpandedChart = "trends" | "monthly" | "source" | "status" | null;

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconExpand() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 16.25v-4.5m0 4.5h4.5m-4.5 0L9 11M16.25 3.75h-4.5m4.5 0v4.5m0-4.5L11 9M16.25 16.25h-4.5m4.5 0v-4.5m0 4.5L11 11"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

// ─── Shared chart tooltip ─────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-xl text-[12px] min-w-[140px]">
      {label && (
        <p className="mb-2 font-semibold text-neutral-700 border-b border-neutral-100 pb-1.5">
          {label}
        </p>
      )}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ background: p.color }}
            />
            {p.name}
          </span>
          <span className="font-semibold text-neutral-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accentClass = "text-neutral-900",
}: {
  label: string;
  value: number | string;
  sub?: React.ReactNode;
  accentClass?: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-5 py-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
      <p className={`mt-2 text-4xl font-semibold tabular-nums ${accentClass}`}>
        {value}
      </p>
      {sub && <p className="mt-1.5 text-[11px]">{sub}</p>}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  onExpand,
  onExpand,
  children,
}: {
  title: string;
  subtitle?: string;
  onExpand?: () => void;
  onExpand?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-6 pb-6 pt-5">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            {title}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-[12px] text-neutral-500">{subtitle}</p>
          )}
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            title="Expand chart"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-500 shadow-sm transition hover:border-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 hover:shadow"
          >
            <IconExpand />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Empty chart placeholder ──────────────────────────────────────────────────

function EmptyChart({ message = "No data yet." }: { message?: string }) {
  return (
    <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
      {message}
    </div>
  );
}

// ─── Source legend row ────────────────────────────────────────────────────────

function BreakdownRow({
  color,
  label,
  count,
  total,
}: {
  color: string;
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-[13px]">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span className="flex-1 text-neutral-600">{label}</span>
      <span className="text-[11px] text-neutral-400 w-8 text-right">
        {pct}%
      </span>
      <span className="font-semibold text-neutral-900 w-6 text-right">
        {count}
      </span>
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────

function ChartModal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-6"
      onClick={onClose}
    >
      <div
        className="my-4 w-full max-w-5xl rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-neutral-100 px-7 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {title}
            </p>
            {subtitle && (
              <p className="mt-0.5 text-[12px] text-neutral-500">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <IconClose />
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Expanded data tables ─────────────────────────────────────────────────────

function MonthlyDataTable({ monthly }: { monthly: MonthSlot[] }) {
  const totals = monthly.reduce(
    (acc, m) => ({
      total: acc.total + m.total,
      buyer: acc.buyer + m.buyer,
      developer: acc.developer + m.developer,
      general: acc.general + m.general,
    }),
    { total: 0, buyer: 0, developer: 0, general: 0 }
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-neutral-100 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            <th className="pb-3 pr-6">Month</th>
            <th className="pb-3 pr-6 text-right">Total</th>
            <th className="pb-3 pr-6 text-right" style={{ color: GOLD }}>
              Buyer / Investor
            </th>
            <th className="pb-3 pr-6 text-right text-neutral-400">Developer</th>
            <th className="pb-3 text-right text-neutral-400">General</th>
          </tr>
        </thead>
        <tbody>
          {monthly.map((m) => (
            <tr
              key={m.label}
              className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60"
            >
              <td className="py-2.5 pr-6 font-medium text-neutral-700">{m.label}</td>
              <td
                className={`py-2.5 pr-6 text-right font-semibold ${
                  m.total > 0 ? "text-neutral-900" : "text-neutral-300"
                }`}
              >
                {m.total}
              </td>
              <td
                className={`py-2.5 pr-6 text-right ${
                  m.buyer > 0 ? "text-neutral-700" : "text-neutral-300"
                }`}
              >
                {m.buyer}
              </td>
              <td
                className={`py-2.5 pr-6 text-right ${
                  m.developer > 0 ? "text-neutral-700" : "text-neutral-300"
                }`}
              >
                {m.developer}
              </td>
              <td
                className={`py-2.5 text-right ${
                  m.general > 0 ? "text-neutral-700" : "text-neutral-300"
                }`}
              >
                {m.general}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-neutral-200">
            <td className="pt-3.5 pr-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Total
            </td>
            <td className="pt-3.5 pr-6 text-right text-[15px] font-bold text-neutral-900">
              {totals.total}
            </td>
            <td className="pt-3.5 pr-6 text-right font-semibold text-neutral-700">
              {totals.buyer}
            </td>
            <td className="pt-3.5 pr-6 text-right font-semibold text-neutral-700">
              {totals.developer}
            </td>
            <td className="pt-3.5 text-right font-semibold text-neutral-700">
              {totals.general}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function BreakdownTable({
  rows,
  colors,
  total,
}: {
  rows: { key: string; name: string; count: number }[];
  colors: Record<string, string>;
  total: number;
}) {
  return (
    <table className="w-full text-left text-[13px]">
      <thead>
        <tr className="border-b border-neutral-100 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          <th className="pb-3 pr-6">Category</th>
          <th className="pb-3 pr-6 text-right">Count</th>
          <th className="pb-3 text-right">Share</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const pct = total > 0 ? ((row.count / total) * 100).toFixed(1) : "0.0";
          return (
            <tr
              key={row.key}
              className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60"
            >
              <td className="py-3 pr-6">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: colors[row.key] ?? "#ccc" }}
                  />
                  <span className="font-medium text-neutral-700">{row.name}</span>
                </div>
              </td>
              <td className="py-3 pr-6 text-right font-semibold text-neutral-900">
                {row.count}
              </td>
              <td className="py-3 text-right">
                <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
                  {pct}%
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr className="border-t-2 border-neutral-200">
          <td className="pt-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Total
          </td>
          <td className="pt-3.5 pr-6 text-right text-[15px] font-bold text-neutral-900">
            {total}
          </td>
          <td className="pt-3.5 text-right">
            <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
              100%
            </span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<ExpandedChart>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setError("Failed to load statistics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center py-24 text-sm text-neutral-400">
        Loading statistics…
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mt-10 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "No data available."}
      </div>
    );
  }

  const { summary, monthly, byType, byStatus } = stats;

  // Month-over-month change
  const monthlyChange =
    summary.lastMonth === 0
      ? null
      : ((summary.thisMonth - summary.lastMonth) / summary.lastMonth) * 100;

  const changeSub =
    monthlyChange === null ? (
      <span className="text-neutral-400">No data last month</span>
    ) : monthlyChange > 0 ? (
      <span className="text-emerald-600">
        ▲ {Math.round(monthlyChange)}% from last month
      </span>
    ) : monthlyChange < 0 ? (
      <span className="text-red-500">
        ▼ {Math.abs(Math.round(monthlyChange))}% from last month
      </span>
    ) : (
      <span className="text-neutral-400">Same as last month</span>
    );

  const totalByType = byType.reduce((s, t) => s + t.count, 0);
  const hasMonthlyData = monthly.some((m) => m.total > 0);

  return (
    <>
    <div className="mt-10 flex flex-col gap-6">

      {/* ── 1. Summary stat cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Enquiries Received"
          value={summary.total}
          accentClass="text-neutral-900"
        />
        <StatCard
          label="This Month"
          value={summary.thisMonth}
          sub={changeSub}
          accentClass={
            summary.thisMonth > summary.lastMonth
              ? "text-emerald-700"
              : "text-neutral-900"
          }
        />
        <StatCard
          label="Last Month"
          value={summary.lastMonth}
        />
        <StatCard
          label="Pending Review"
          value={summary.pending}
          accentClass={summary.pending > 0 ? "text-amber-700" : "text-neutral-900"}
          sub={
            summary.pending > 0 ? (
              <span className="text-amber-600">Awaiting action</span>
            ) : (
              <span className="text-neutral-400">All up to date</span>
            )
          }
        />
      </div>

      {/* ── 2. Monthly enquiry trends — LINE GRAPH ── */}
      <ChartCard
        title="Monthly Enquiry Trends"
        subtitle="Total enquiries received per month over the last 12 months"
        onExpand={() => setExpanded("trends")}
      >
        {!hasMonthlyData ? (
          <EmptyChart message="No enquiries recorded in the last 12 months." />
        ) : (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={monthly}
                margin={{ top: 8, right: 16, left: -18, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#a49a8d" }}
                  axisLine={{ stroke: LIGHT }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#a49a8d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    paddingTop: 16,
                    color: "#7a7166",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#2f2923"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2f2923", stroke: "white", strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: "#2f2923", stroke: "white", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="buyer"
                  name="Buyer / Investor"
                  stroke={GOLD}
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: GOLD, stroke: "white", strokeWidth: 1.5 }}
                  activeDot={{ r: 4, fill: GOLD, stroke: "white", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="developer"
                  name="Developer"
                  stroke="#6b7280"
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: "#6b7280", stroke: "white", strokeWidth: 1.5 }}
                  activeDot={{ r: 4, fill: "#6b7280", stroke: "white", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="general"
                  name="General"
                  stroke={MID}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={{ r: 3, fill: MID, stroke: "white", strokeWidth: 1.5 }}
                  activeDot={{ r: 4, fill: MID, stroke: "white", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      {/* ── 3. Monthly source breakdown — STACKED BAR ── */}
      <ChartCard
        title="Monthly Enquiry Source Breakdown"
        subtitle="Enquiry volume by source type for each of the last 12 months"
        onExpand={() => setExpanded("monthly")}
      >
        {!hasMonthlyData ? (
          <EmptyChart />
        ) : (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={monthly}
                margin={{ top: 4, right: 16, left: -18, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#a49a8d" }}
                  axisLine={{ stroke: LIGHT }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#a49a8d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9f7f4" }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12, color: "#7a7166" }} />
                <Bar dataKey="buyer" name="Buyer / Investor" stackId="a" fill={GOLD} />
                <Bar dataKey="developer" name="Developer" stackId="a" fill="#6b7280" />
                <Bar dataKey="general" name="General" stackId="a" fill={MID} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      {/* ── 4. Total source breakdown + status breakdown ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Total enquiry source breakdown */}
        <ChartCard
          title="Total Enquiry Source Breakdown"
          subtitle="All-time distribution by enquiry type"
          onExpand={() => setExpanded("source")}
        >
          {totalByType === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={byType.filter((t) => t.count > 0)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {byType
                      .filter((t) => t.count > 0)
                      .map((t) => (
                        <Cell key={t.key} fill={TYPE_COLORS[t.key] ?? "#ccc"} />
                      ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-3 space-y-2.5">
                {byType.map((t) => (
                  <BreakdownRow
                    key={t.key}
                    color={TYPE_COLORS[t.key] ?? "#ccc"}
                    label={TYPE_LABEL[t.key] ?? t.name}
                    count={t.count}
                    total={totalByType}
                  />
                ))}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[13px]">
                  <span className="font-medium text-neutral-700">Total</span>
                  <span className="font-semibold text-neutral-900">
                    {totalByType}
                  </span>
                </div>
              </div>
            </>
          )}
        </ChartCard>

        {/* Enquiry status distribution */}
        <ChartCard
          title="Enquiry Status Distribution"
          subtitle="Current pipeline status across all enquiries"
          onExpand={() => setExpanded("status")}
        >
          {summary.total === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={byStatus.filter((s) => s.count > 0)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {byStatus
                      .filter((s) => s.count > 0)
                      .map((s) => (
                        <Cell
                          key={s.key}
                          fill={STATUS_COLORS[s.key] ?? "#ccc"}
                        />
                      ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-3 space-y-2.5">
                {byStatus.map((s) => (
                  <BreakdownRow
                    key={s.key}
                    color={STATUS_COLORS[s.key] ?? "#ccc"}
                    label={s.name}
                    count={s.count}
                    total={summary.total}
                  />
                ))}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[13px]">
                  <span className="font-medium text-neutral-700">Total</span>
                  <span className="font-semibold text-neutral-900">
                    {summary.total}
                  </span>
                </div>
              </div>
            </>
          )}
        </ChartCard>
      </div>
    </div>

    {/* ── Expanded chart modals ── */}

    {expanded === "trends" && (
      <ChartModal
        title="Monthly Enquiry Trends"
        subtitle="Total enquiries received per month over the last 12 months"
        onClose={() => setExpanded(null)}
      >
        {!hasMonthlyData ? (
          <EmptyChart message="No enquiries recorded in the last 12 months." />
        ) : (
          <ResponsiveContainer width="100%" height={440}>
            <LineChart data={monthly} margin={{ top: 8, right: 16, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#a49a8d" }} axisLine={{ stroke: LIGHT }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#a49a8d" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 16, color: "#7a7166" }} />
              <Line type="monotone" dataKey="total" name="Total" stroke={DARK} strokeWidth={2.5} dot={{ r: 3, fill: DARK, stroke: "white", strokeWidth: 1.5 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="buyer" name="Buyer / Investor" stroke={GOLD} strokeWidth={1.5} dot={{ r: 3, fill: GOLD, stroke: "white", strokeWidth: 1.5 }} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="developer" name="Developer" stroke="#6b7280" strokeWidth={1.5} dot={{ r: 3, fill: "#6b7280", stroke: "white", strokeWidth: 1.5 }} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="general" name="General" stroke={MID} strokeWidth={1.5} strokeDasharray="4 3" dot={{ r: 3, fill: MID, stroke: "white", strokeWidth: 1.5 }} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
        <div className="mt-8 border-t border-neutral-100 pt-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Monthly Breakdown
          </p>
          <MonthlyDataTable monthly={monthly} />
        </div>
      </ChartModal>
    )}

    {expanded === "monthly" && (
      <ChartModal
        title="Monthly Enquiry Source Breakdown"
        subtitle="Enquiry volume by source type for each of the last 12 months"
        onClose={() => setExpanded(null)}
      >
        {!hasMonthlyData ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={monthly} margin={{ top: 4, right: 16, left: -18, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#a49a8d" }} axisLine={{ stroke: LIGHT }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#a49a8d" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9f7f4" }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12, color: "#7a7166" }} />
              <Bar dataKey="buyer" name="Buyer / Investor" stackId="a" fill={GOLD} />
              <Bar dataKey="developer" name="Developer" stackId="a" fill="#6b7280" />
              <Bar dataKey="general" name="General" stackId="a" fill={MID} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="mt-8 border-t border-neutral-100 pt-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Monthly Breakdown
          </p>
          <MonthlyDataTable monthly={monthly} />
        </div>
      </ChartModal>
    )}

    {expanded === "source" && (
      <ChartModal
        title="Total Enquiry Source Breakdown"
        subtitle="All-time distribution by enquiry type"
        onClose={() => setExpanded(null)}
      >
        {totalByType === 0 ? (
          <EmptyChart />
        ) : (
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="shrink-0 md:w-[320px]">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={byType.filter((t) => t.count > 0)} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={68} outerRadius={120} paddingAngle={3}>
                    {byType.filter((t) => t.count > 0).map((t) => (
                      <Cell key={t.key} fill={TYPE_COLORS[t.key] ?? "#ccc"} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12, color: "#7a7166" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <BreakdownTable
                rows={byType.map((t) => ({ ...t, name: TYPE_LABEL[t.key] ?? t.name }))}
                colors={TYPE_COLORS}
                total={totalByType}
              />
            </div>
          </div>
        )}
      </ChartModal>
    )}

    {expanded === "status" && (
      <ChartModal
        title="Enquiry Status Distribution"
        subtitle="Current pipeline status across all enquiries"
        onClose={() => setExpanded(null)}
      >
        {summary.total === 0 ? (
          <EmptyChart />
        ) : (
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="shrink-0 md:w-[320px]">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={byStatus.filter((s) => s.count > 0)} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={68} outerRadius={120} paddingAngle={3}>
                    {byStatus.filter((s) => s.count > 0).map((s) => (
                      <Cell key={s.key} fill={STATUS_COLORS[s.key] ?? "#ccc"} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12, color: "#7a7166" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <BreakdownTable
                rows={byStatus}
                colors={STATUS_COLORS}
                total={summary.total}
              />
            </div>
          </div>
        )}
      </ChartModal>
    )}
    </>
  );
}
