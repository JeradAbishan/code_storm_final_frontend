/**
 * Dashboard Page
 * Main dashboard for authenticated users
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Shield, 
  Settings, 
  FileText, 
  Upload,
  Brain,
  BarChart3
} from 'lucide-react';

function DashboardContent() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending_email_verification':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.first_name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready to enhance your learning today?
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={logout}
              size="sm"
            >
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white font-semibold">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Email {user.is_email_verified ? 'verified' : 'pending verification'}</span>
                  <Badge 
                    className={user.is_email_verified 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }
                  >
                    {user.is_email_verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Born {formatDate(user.date_of_birth)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Account status</span>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                {user.last_login_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last login: {formatDate(user.last_login_at)}</span>
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with EduCapture's powerful features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Upload className="h-6 w-6" />
                  <span>Upload Notes</span>
                </Button>
                
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Brain className="h-6 w-6" />
                  <span>AI Enhancement</span>
                </Button>
                
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <FileText className="h-6 w-6" />
                  <span>View Library</span>
                </Button>
                
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <BarChart3 className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Your Statistics</CardTitle>
              <CardDescription>
                Track your learning progress and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {user.login_count}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Logins</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                  <div className="text-sm text-muted-foreground">Notes Enhanced</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                  <div className="text-sm text-muted-foreground">AI Insights</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-muted-foreground">Member Since</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true} requireVerification={true}>
      <DashboardContent />
    </AuthGuard>
  );
}
