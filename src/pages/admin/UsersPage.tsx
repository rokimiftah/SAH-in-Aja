import { useState } from "react";

import { useQuery } from "convex/react";
import { format } from "date-fns";
import { ArrowLeft, Building2, Calendar, Filter, Mail, Phone, Search, Shield, User } from "lucide-react";
import { Link } from "wouter";

import { api } from "../../../convex/_generated/api";

export function UsersPage() {
  const users = useQuery(api.admin.getAllUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all, admin, user

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesRole = roleFilter === "all" || user.role === roleFilter || (roleFilter === "user" && !user.role);

    return matchesSearch && matchesRole;
  });

  if (!users)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Mobile Back Button - Sticky at top */}
      <div className="shrink-0 px-1 pt-1 sm:hidden">
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <Link
            href="/admin"
            className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-gray-500">View and manage registered users</p>
          </div>
          <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 sm:w-auto sm:self-auto">
            <User className="h-4 w-4" />
            <span>
              Total: <strong className="text-gray-900">{users.length}</strong> users
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pr-8 pl-9 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none sm:w-auto"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins Only</option>
                  <option value="user">Users Only</option>
                </select>
                {/* Custom dropdown arrow to ensure consistent look */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="min-w-62.5 px-6 py-4 font-semibold text-gray-900">User Profile</th>
                  <th className="min-w-50 px-6 py-4 font-semibold text-gray-900">Contact Info</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-gray-900">Role</th>
                  <th className="min-w-37.5 px-6 py-4 font-semibold text-gray-900">Business</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-gray-900">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No users found matching your search
                    </td>
                  </tr>
                ) : (
                  filteredUsers?.map((user) => (
                    <tr key={user._id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name || user.email}`}
                            alt=""
                            className="h-10 w-10 rounded-full border border-gray-200 bg-gray-100 object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name || "Unknown Name"}</p>
                            <p className="text-xs text-gray-500">ID: {user._id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-gray-600">
                          {user.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              <span>{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {!user.email && !user.phone && <span className="text-gray-400">-</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            user.role === "admin"
                              ? "border-purple-200 bg-purple-50 text-purple-700"
                              : "border-gray-200 bg-gray-50 text-gray-700"
                          }`}
                        >
                          {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {user.role === "admin" ? "Administrator" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.businessName ? (
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{user.businessName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {user.createdAt ? format(user.createdAt, "MMM d, yyyy") : "-"}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
