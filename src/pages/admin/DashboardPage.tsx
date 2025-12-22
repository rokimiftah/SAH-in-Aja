import { useQuery } from "convex/react";
import { ArrowDownRight, ArrowUpRight, Camera, FileText, Tag, Users } from "lucide-react";
import { Link } from "wouter";

import { api } from "../../../convex/_generated/api";

export function AdminDashboard() {
  const stats = useQuery(api.admin.getDashboardStats);

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  const cards = [
    {
      name: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/users",
      change: stats.userGrowth,
      trend: stats.userTrend,
    },
    {
      name: "Total Scans",
      value: stats.totalScans,
      icon: Camera,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/admin", // No specific page yet
      change: stats.scanGrowth,
      trend: stats.scanTrend,
    },
    {
      name: "Documents Generated",
      value: stats.totalDocs,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin", // No specific page yet
      change: stats.docGrowth,
      trend: stats.docTrend,
    },
  ];

  return (
    <div className="h-full space-y-8 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-gray-500">Welcome back, Admin! Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.name} href={card.href}>
            <div className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-orange-100 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className={`rounded-xl p-3 ${card.bg} ${card.color} transition-colors`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                    card.trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {card.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {card.change}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-orange-600">{card.name}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section Placeholder */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Users</h3>
            <Link href="/admin/users" className="text-sm font-medium text-orange-600 hover:text-orange-700">
              View All
            </Link>
          </div>
          <div className="flex-1">
            {/* We can map recent users here later */}
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500">
              No recent activity to display
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/admin/promos" className="h-full">
              <div className="flex h-full min-h-30 flex-col items-center justify-center rounded-xl border border-orange-100 bg-orange-50 p-4 text-center transition-colors hover:bg-orange-100">
                <Tag className="mx-auto mb-2 h-6 w-6 text-orange-600" />
                <p className="font-medium text-gray-900">Create Promo</p>
                <p className="text-xs text-gray-500">Add credits</p>
              </div>
            </Link>
            <Link href="/admin/users" className="h-full">
              <div className="flex h-full min-h-30 flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50 p-4 text-center transition-colors hover:bg-blue-100">
                <Users className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-xs text-gray-500">View details</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
