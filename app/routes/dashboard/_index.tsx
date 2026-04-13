import type { ClientLoaderFunctionArgs } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { fetchUsers } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
}

interface LoaderData {
  stats: Stats | null;
  error: string | null;
}

// Loader function - runs before component renders (single request)
export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || localStorage.getItem('token');
  
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const response = await fetchUsers();
    const users = response.users;
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter((u: any) => u.isActive).length,
    };
    return { stats, error: null };
  } catch (error: any) {
    return { 
      stats: null, 
      error: error.message || 'Failed to fetch stats' 
    };
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, error } = useLoaderData<typeof clientLoader>();
  const [refreshKey, setRefreshKey] = useState(0);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
    },
    {
      title: 'Growth',
      value: '+12%',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.fullName || user?.username}!
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {index === 2 && (
                    <Badge variant="success" size="sm">
                      <TrendingUp size={12} className="mr-1" />
                      +2.5%
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Welcome Card */}
        <Card className="mb-8 border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8">
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={user?.fullName || user?.username} size="xl" />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user?.fullName || user?.username}
                </h2>
                <p className="text-violet-200">{user?.email}</p>
              </div>
            </div>
            <p className="text-violet-100">
              Manage your users, track analytics, and monitor system activity from one place.
            </p>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard/users">
                <Button size="lg" className="group">
                  Manage Users
                  <ArrowRight size={18} className="mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Activity size={18} className="mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Users', icon: Users, href: '/dashboard/users', color: 'violet' },
            { title: 'Analytics', icon: Activity, href: '#', color: 'blue' },
            { title: 'Settings', icon: TrendingUp, href: '#', color: 'emerald' },
            { title: 'Help', icon: UserCheck, href: '#', color: 'amber' },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {item.title}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
